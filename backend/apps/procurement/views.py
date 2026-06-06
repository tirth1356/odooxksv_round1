from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import Sum, F
from apps.rfqs.models import RFQ
from apps.vendors.models import Vendor
from .models import (
    Approval,
    ApprovalStep,
    PurchaseOrder,
    POItem,
    POTimelineEvent,
    Invoice,
    InvoiceItem,
    InvoiceTimelineEvent,
    ActivityLog,
    Quotation,
)
from .serializers import (
    ApprovalSerializer,
    PurchaseOrderSerializer,
    InvoiceSerializer,
    ActivityLogSerializer,
    QuotationSerializer,
)


class MockDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        active_rfqs_count = RFQ.objects.filter(status='Open').count()
        pending_approvals = Approval.objects.filter(status='L2 Pending').count()
        overdue_invoices = Invoice.objects.filter(status='Pending Payment').count()

        # Calculate total spend from POs using proper DecimalField aggregation
        total_spend_result = PurchaseOrder.objects.aggregate(total=Sum('grand_total'))
        total_spend = total_spend_result['total'] or 0

        # Dynamic budget percentage (assume a nominal budget of 50 Lakhs / 5M INR for demo purposes)
        nominal_budget = 5000000
        budget_percentage = int((float(total_spend) / nominal_budget) * 100) if total_spend > 0 else 0

        if total_spend >= 100000:
            pos_this_month = f"{float(total_spend) / 100000:.1f}L"
        else:
            pos_this_month = f"{total_spend:,}"

        # Calculate average days late for overdue invoices
        overdue_invoices_qs = Invoice.objects.filter(status='Pending Payment', due_date__lt=timezone.now().date())
        overdue_invoices_count = overdue_invoices_qs.count()
        avg_days_late = 0
        if overdue_invoices_count > 0:
            total_days_late = sum((timezone.now().date() - inv.due_date).days for inv in overdue_invoices_qs)
            avg_days_late = total_days_late // overdue_invoices_count

        # Recent POs with proper FK lookups
        recent_pos = []
        pos = PurchaseOrder.objects.select_related('vendor').order_by('-created_at')[:3]
        for po in pos:
            recent_pos.append({
                "po_number": po.po_number,
                "vendor": po.vendor.vendor_name if po.vendor else "Unknown",
                "amount": int(po.grand_total),
                "status": po.status
            })

        # Monthly spending trends using proper DateField extraction
        now = timezone.now()
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        trend_months = []
        trend_amounts = []

        for i in range(5, -1, -1):
            m_idx = (now.month - 1 - i) % 12
            trend_months.append(months[m_idx])
            # Calculate actual year for that month
            year = now.year if (now.month - i) > 0 else now.year - 1
            month_num = m_idx + 1
            month_total = PurchaseOrder.objects.filter(
                date__year=year, date__month=month_num
            ).aggregate(total=Sum('grand_total'))['total'] or 0
            trend_amounts.append(float(month_total))

        # Fallback if no data maps to these months
        if sum(trend_amounts) == 0 and PurchaseOrder.objects.exists():
            trend_amounts[-2] = float(PurchaseOrder.objects.aggregate(total=Sum('grand_total'))['total'] or 0)

        # Spending categories breakdown for doughnut chart
        categories_agg = PurchaseOrder.objects.values('vendor__category').annotate(total=Sum('grand_total')).order_by('-total')
        total_all_spend = sum(float(c['total'] or 0) for c in categories_agg)
        
        spending_categories = []
        colors = ['#4edea3', '#ffc107', '#3b82f6', '#ec4899', '#a855f7']
        
        for idx, c in enumerate(categories_agg[:3]):
            cat_name = c['vendor__category'] or 'Other'
            cat_total = float(c['total'] or 0)
            percentage = int((cat_total / total_all_spend) * 100) if total_all_spend > 0 else 0
            
            # Format currency nicely
            if cat_total >= 1000000:
                fmt_amount = f"₹ {cat_total / 1000000:.1f}M"
            elif cat_total >= 100000:
                fmt_amount = f"₹ {cat_total / 100000:.1f}L"
            else:
                fmt_amount = f"₹ {cat_total / 1000:.1f}K"
                
            spending_categories.append({
                "name": cat_name,
                "amount": fmt_amount,
                "percentage": percentage,
                "color": colors[idx % len(colors)]
            })

        data = {
            "kpis": {
                "active_rfqs": active_rfqs_count,
                "pending_approvals": pending_approvals,
                "pos_this_month": pos_this_month,
                "overdue_invoices": overdue_invoices_count,
                "avg_days_late": avg_days_late,
                "budget_percentage": budget_percentage
            },
            "recent_purchase_orders": recent_pos,
            "spending_trends": {
                "months": trend_months,
                "amounts": trend_amounts
            },
            "spending_categories": spending_categories
        }
        return Response(data)


class MockApprovalsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        approval = Approval.objects.select_related(
            'quotation', 'quotation__rfq', 'quotation__vendor'
        ).prefetch_related('approval_chain').first()

        if not approval:
            return Response({"error": "No approval configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApprovalSerializer(approval)
        return Response(serializer.data)

    def post(self, request):
        approval = Approval.objects.select_related(
            'quotation', 'quotation__rfq', 'quotation__vendor'
        ).prefetch_related('approval_chain').first()

        if not approval:
            return Response({"error": "No approval configured in DB"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action", "approve")
        remarks = request.data.get("remarks", "")

        approval.remarks = remarks
        if action == "approve":
            approval.status = "Approved"
            approval.processed_at = timezone.now()
            approval.save()

            for step in approval.approval_chain.all():
                if step.name == "Priya Shah":
                    step.status = "Approved"
                    step.info = "Approved just now"
                    step.save()
                elif step.name == "David Chen":
                    step.status = "Awaiting"
                    step.info = "Assigned just now"
                    step.save()

            ActivityLog.objects.create(
                title="L2 Approved",
                description=f"Quotation L2 approved by Priya Shah. Remarks: {remarks}",
                category="Approvals",
            )
        else:
            approval.status = "Rejected"
            approval.processed_at = timezone.now()
            approval.save()

            for step in approval.approval_chain.all():
                if step.name == "Priya Shah":
                    step.status = "Rejected"
                    step.info = "Rejected just now"
                    step.save()

            ActivityLog.objects.create(
                title="Quotation Rejected",
                description=f"Quotation L2 rejected by Priya Shah. Remarks: {remarks}",
                category="Approvals",
            )

        serializer = ApprovalSerializer(approval)
        return Response({"message": f"Quotation {action}d successfully.", "data": serializer.data})


class MockPOView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        po = PurchaseOrder.objects.select_related('vendor', 'quotation').prefetch_related('items', 'timeline').first()
        if not po:
            return Response({"error": "No PO configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PurchaseOrderSerializer(po)
        return Response(serializer.data)

    def post(self, request):
        po = PurchaseOrder.objects.select_related('vendor').first()
        if not po:
            return Response({"error": "No PO configured in DB"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")
        if action == "cancel":
            po.status = "Cancelled"
            po.save()

            POTimelineEvent.objects.create(
                purchase_order=po,
                title="PO Cancelled by Manager",
                completed=True,
                is_error=True,
            )

        serializer = PurchaseOrderSerializer(po)
        return Response(serializer.data)


class MockInvoiceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        invoice = Invoice.objects.select_related('vendor', 'purchase_order').prefetch_related('items', 'timeline').first()
        if not invoice:
            return Response({"error": "No invoice configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    def post(self, request):
        invoice = Invoice.objects.select_related('vendor').first()
        if not invoice:
            return Response({"error": "No invoice configured in DB"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")
        if action == "pay":
            invoice.status = "Paid"
            invoice.save()

            invoice.timeline.filter(title="Awaiting Payment Confirmation").delete()
            InvoiceTimelineEvent.objects.create(
                invoice=invoice,
                title="Paid by Alex Thompson",
                completed=True,
            )
        elif action == "cancel":
            invoice.status = "Cancelled"
            invoice.save()

            InvoiceTimelineEvent.objects.create(
                invoice=invoice,
                title="Invoice Cancelled by Manager",
                completed=True,
                is_error=True,
            )

        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)


class MockActivityLogsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        logs = ActivityLog.objects.select_related('user').order_by('-timestamp')
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)

class QuotationSubmitView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        quotes = Quotation.objects.all().order_by('-id')
        serializer = QuotationSerializer(quotes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuotationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            ActivityLog.objects.create(
                title="Quotation Submitted",
                description=f"Vendor submitted a new quote for RFQ #{serializer.instance.rfq_id}.",
                category="Quotations"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
