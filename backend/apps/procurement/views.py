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


from rest_framework_simplejwt.authentication import JWTAuthentication

class MockDashboardView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

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

        # Get vendor specific counts
        vendor_assigned_rfqs = 0
        vendor_submitted_bids = 0
        vendor_active_orders = 0
        vendor_unpaid_invoices = 0

        vendor = None
        if request.user and request.user.is_authenticated:
            vendor = getattr(request.user, 'vendor_profile', None)

        if vendor:
            vendor_assigned_rfqs = vendor.assigned_rfqs.filter(status='Open').count()
            vendor_submitted_bids = Quotation.objects.filter(vendor=vendor).count()
            vendor_active_orders = PurchaseOrder.objects.filter(vendor=vendor).exclude(status='Cancelled').count()
            vendor_unpaid_invoices = Invoice.objects.filter(vendor=vendor, status='Pending Payment').count()
        else:
            vendor_assigned_rfqs = active_rfqs_count
            vendor_submitted_bids = Quotation.objects.count()
            vendor_active_orders = PurchaseOrder.objects.exclude(status='Cancelled').count()
            vendor_unpaid_invoices = overdue_invoices

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

        spending_categories = []
        colors = ['#4edea3', '#ffc107', '#3b82f6', '#ec4899', '#a855f7']

        if vendor:
            from django.db.models import Count
            statuses_agg = Quotation.objects.filter(vendor=vendor).values('status').annotate(count=Count('id'))
            total_quotes = sum(s['count'] for s in statuses_agg)
            for idx, s in enumerate(statuses_agg[:4]):
                percentage = int((s['count'] / total_quotes) * 100) if total_quotes > 0 else 0
                spending_categories.append({
                    "name": s['status'],
                    "amount": f"{s['count']} Bids",
                    "percentage": percentage,
                    "color": colors[idx % len(colors)]
                })
        else:
            categories_agg = PurchaseOrder.objects.values('vendor__category').annotate(total=Sum('grand_total')).order_by('-total')
            total_all_spend = sum(float(c['total'] or 0) for c in categories_agg)
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
                "budget_percentage": budget_percentage,
                "total_vendors": Vendor.objects.count(),
                "error_logs": 0,
                "vendor_assigned_rfqs": vendor_assigned_rfqs,
                "vendor_submitted_bids": vendor_submitted_bids,
                "vendor_active_orders": vendor_active_orders,
                "vendor_unpaid_invoices": vendor_unpaid_invoices
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
        ).prefetch_related('approval_chain').order_by('-id').first()

        if not approval:
            return Response({"error": "No approval configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApprovalSerializer(approval)
        return Response(serializer.data)

    def post(self, request):
        approval = Approval.objects.select_related(
            'quotation', 'quotation__rfq', 'quotation__vendor'
        ).prefetch_related('approval_chain').order_by('-id').first()

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
                if "L2" in step.role or step.name == "Priya Shah":
                    step.status = "Approved"
                    step.info = "Approved just now"
                    step.save()
                elif "VP" in step.role or step.name == "David Chen":
                    step.status = "Awaiting"
                    step.info = "Assigned just now"
                    step.save()

            ActivityLog.objects.create(
                title="L2 Approved",
                description=f"Quotation L2 approved by Priya Shah. Remarks: {remarks}",
                category="Approvals",
            )

            # --- DYNAMICALLY GENERATE A PURCHASE ORDER ---
            from datetime import timedelta
            from decimal import Decimal
            from apps.procurement.models import Quotation as ProcQuotation

            if not PurchaseOrder.objects.filter(quotation=approval.quotation).exists():
                # Try to find the proc_quote to get line items
                proc_quote = ProcQuotation.objects.filter(rfq_id=str(approval.quotation.rfq.id)).order_by('-id').first()

                po_number = f"PO-2026-{1000 + approval.id}"
                po = PurchaseOrder.objects.create(
                    po_number=po_number,
                    quotation=approval.quotation,
                    vendor=approval.quotation.vendor,
                    date=timezone.now().date(),
                    delivery_date=timezone.now().date() + timedelta(days=approval.quotation.delivery_days),
                    status="Issued",
                    subtotal=approval.quotation.total_price / Decimal("1.18"),
                    grand_total=approval.quotation.total_price,
                )

                if proc_quote:
                    for item in proc_quote.line_items.all():
                        POItem.objects.create(
                            purchase_order=po,
                            description=item.desc,
                            qty=item.qty,
                            price=item.unit_price,
                            total=item.qty * item.unit_price,
                        )
                else:
                    POItem.objects.create(
                        purchase_order=po,
                        description="Office Equipment",
                        qty=1,
                        price=approval.quotation.total_price / Decimal("1.18"),
                        total=approval.quotation.total_price / Decimal("1.18"),
                    )

                POTimelineEvent.objects.create(purchase_order=po, title="RFQ Created by Officer", completed=True)
                POTimelineEvent.objects.create(purchase_order=po, title="Bids Submitted by Vendor", completed=True)
                POTimelineEvent.objects.create(purchase_order=po, title="Quotation Approved by Manager", completed=True)
                POTimelineEvent.objects.create(purchase_order=po, title="PO Generated and Sent", completed=True)
        else:
            approval.status = "Rejected"
            approval.processed_at = timezone.now()
            approval.save()

            for step in approval.approval_chain.all():
                if "L2" in step.role or step.name == "Priya Shah":
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
        po = PurchaseOrder.objects.select_related('vendor', 'quotation').prefetch_related('items', 'timeline').order_by('-id').first()
        if not po:
            return Response({"error": "No PO configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PurchaseOrderSerializer(po)
        return Response(serializer.data)

    def post(self, request):
        po = PurchaseOrder.objects.select_related('vendor').order_by('-id').first()
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
        invoice = Invoice.objects.select_related('vendor', 'purchase_order').prefetch_related('items', 'timeline').order_by('-id').first()
        if not invoice:
            return Response({"error": "No invoice configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    def post(self, request):
        invoice = Invoice.objects.select_related('vendor').order_by('-id').first()
        action = request.data.get("action")

        if action == "generate":
            po_number = request.data.get("po_number")
            po = None
            if po_number:
                po = PurchaseOrder.objects.filter(po_number=po_number).first()
            if not po:
                po = PurchaseOrder.objects.order_by('-id').first()
            if not po:
                return Response({"error": "No Purchase Order found to generate Invoice"}, status=status.HTTP_404_NOT_FOUND)

            from datetime import timedelta
            from decimal import Decimal

            # Check if invoice already exists for this PO, otherwise create it
            invoice = Invoice.objects.filter(purchase_order=po).first()
            if not invoice:
                invoice_number = f"INV-2026-{1000 + po.id}"
                invoice = Invoice.objects.create(
                    invoice_number=invoice_number,
                    purchase_order=po,
                    vendor=po.vendor,
                    date=timezone.now().date(),
                    due_date=timezone.now().date() + timedelta(days=30),
                    status="Pending Payment",
                    subtotal=po.subtotal,
                    cgst=po.subtotal * Decimal("0.09"),
                    sgst=po.subtotal * Decimal("0.09"),
                    grand_total=po.grand_total,
                )
                # Create Invoice Items from PO Items
                for po_item in po.items.all():
                    InvoiceItem.objects.create(
                        invoice=invoice,
                        description=po_item.description,
                        qty=po_item.qty,
                        price=po_item.price,
                        total=po_item.total,
                    )

                InvoiceTimelineEvent.objects.create(invoice=invoice, title="PO Issued", completed=True)
                InvoiceTimelineEvent.objects.create(invoice=invoice, title="Invoice Generated by Vendor", completed=True)
                InvoiceTimelineEvent.objects.create(invoice=invoice, title="Awaiting Payment Confirmation", completed=False)

            serializer = InvoiceSerializer(invoice)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        if not invoice:
            return Response({"error": "No invoice configured in DB"}, status=status.HTTP_404_NOT_FOUND)

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

            # --- DYNAMICALLY COPY TO RFQ QUOTATION & INITIALIZE APPROVAL ---
            from apps.rfqs.models import RFQ, Quotation as RFQQuotation
            from apps.vendors.models import Vendor
            from decimal import Decimal

            # 1. Resolve RFQ
            rfq_id_str = serializer.instance.rfq_id
            rfq = None
            if rfq_id_str.isdigit():
                rfq = RFQ.objects.filter(id=int(rfq_id_str)).first()
            if not rfq:
                rfq = RFQ.objects.filter(status='Open').first()
                if not rfq:
                    rfq = RFQ.objects.first()

            # 2. Resolve Vendor
            vendor = None
            if request.user and request.user.is_authenticated:
                vendor = Vendor.objects.filter(user=request.user).first()
            if not vendor:
                vendor = Vendor.objects.filter(vendor_name="Infra Supplies Pvt Ltd").first()
                if not vendor:
                    vendor = Vendor.objects.first()

            if rfq and vendor:
                line_items = serializer.instance.line_items.all()
                price_per_unit = Decimal("0.00")
                delivery_days = 10
                if line_items.exists():
                    price_per_unit = line_items[0].unit_price
                    delivery_days = max(item.delivery_days for item in line_items)

                # Create the corresponding rfqs.models.Quotation
                rfq_quote = RFQQuotation.objects.create(
                    rfq=rfq,
                    vendor=vendor,
                    price_per_unit=price_per_unit,
                    total_price=serializer.instance.grand_total,
                    delivery_days=delivery_days,
                    vendor_notes=serializer.instance.payment_terms,
                    status='Submitted',
                )

                # 3. Create L2 Approval for this quotation
                from django.contrib.auth import get_user_model
                User = get_user_model()
                officer_user = User.objects.filter(role="Procurement Officer").first()
                manager_user = User.objects.filter(role="Manager").first()

                appr = Approval.objects.create(
                    quotation=rfq_quote,
                    status="L2 Pending",
                    remarks="",
                )
                ApprovalStep.objects.create(
                    approval=appr,
                    approver=officer_user,
                    name=officer_user.get_full_name() if officer_user else "Sarah Jenkins",
                    role="L1 Procurement Officer",
                    status="Approved",
                    info="Submitted just now",
                )
                ApprovalStep.objects.create(
                    approval=appr,
                    approver=manager_user,
                    name=manager_user.get_full_name() if manager_user else "Priya Shah",
                    role="L2 Approver (Procurement Manager)",
                    status="Awaiting",
                    info="Assigned just now",
                )
                ApprovalStep.objects.create(
                    approval=appr,
                    name="David Chen",
                    role="VP Operations / Final Signoff",
                    status="Future",
                    info="",
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
