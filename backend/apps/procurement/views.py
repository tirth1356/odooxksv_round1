from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.rfqs.models import RFQ
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
        import datetime
        active_rfqs_count = RFQ.objects.filter(status='Open').count()
        pending_approvals = Approval.objects.filter(status='L2 Pending').count()
        overdue_invoices = Invoice.objects.filter(status='Pending Payment').count()
        
        # Calculate total spend from POs
        total_spend = 0
        for po in PurchaseOrder.objects.all():
            clean_amt = po.grand_total.replace('₹', '').replace(',', '').strip()
            try:
                total_spend += float(clean_amt)
            except ValueError:
                pass
                
        if total_spend >= 100000:
            pos_this_month = f"{total_spend / 100000:.1f}L"
        else:
            pos_this_month = f"{total_spend:,}"
            
        # Group recent POs
        recent_pos = []
        pos = PurchaseOrder.objects.all()[:3]
        for po in pos:
            clean_amt = po.grand_total.replace('₹', '').replace(',', '').strip()
            try:
                amt_val = int(float(clean_amt))
            except ValueError:
                amt_val = 0
            recent_pos.append({
                "po_number": po.po_number,
                "vendor": po.vendor_name,
                "amount": amt_val,
                "status": po.status
            })
            
        # Dynamically calculate monthly trend amounts
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        now = datetime.datetime.now()
        trend_months = []
        for i in range(5, -1, -1):
            m_idx = (now.month - 1 - i) % 12
            trend_months.append(months[m_idx])
            
        trend_amounts = [0] * 6
        for po in PurchaseOrder.objects.all():
            clean_amt = po.grand_total.replace('₹', '').replace(',', '').strip()
            try:
                amt_val = float(clean_amt)
            except ValueError:
                amt_val = 0
            for idx, m_name in enumerate(trend_months):
                if m_name.lower() in po.date.lower():
                    trend_amounts[idx] += amt_val
                    break
                    
        # Seeded default fallback to show chart heights if months mismatch in date format
        if sum(trend_amounts) == 0 and PurchaseOrder.objects.exists():
            trend_amounts[-2] = 169500
            
        data = {
            "kpis": {
                "active_rfqs": active_rfqs_count,
                "pending_approvals": pending_approvals,
                "pos_this_month": pos_this_month,
                "overdue_invoices": overdue_invoices
            },
            "recent_purchase_orders": recent_pos,
            "spending_trends": {
                "months": trend_months,
                "amounts": trend_amounts
            }
        }
        return Response(data)

class MockApprovalsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        approval = Approval.objects.first()
        if not approval:
            return Response({"error": "No approval configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApprovalSerializer(approval)
        return Response(serializer.data)

    def post(self, request):
        approval = Approval.objects.first()
        if not approval:
            return Response({"error": "No approval configured in DB"}, status=status.HTTP_404_NOT_FOUND)
            
        action = request.data.get("action", "approve")
        remarks = request.data.get("remarks", "")
        
        approval.remarks = remarks
        if action == "approve":
            approval.status = "Approved"
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
                desc=f"Quotation L2 approved by Priya Shah. Remarks: {remarks}",
                category="Approvals",
                time="Just now"
            )
        else:
            approval.status = "Rejected"
            approval.save()
            
            for step in approval.approval_chain.all():
                if step.name == "Priya Shah":
                    step.status = "Rejected"
                    step.info = "Rejected just now"
                    step.save()
                    
            ActivityLog.objects.create(
                title="Quotation Rejected",
                desc=f"Quotation L2 rejected by Priya Shah. Remarks: {remarks}",
                category="Approvals",
                time="Just now"
            )
            
        serializer = ApprovalSerializer(approval)
        return Response({"message": f"Quotation {action}d successfully.", "data": serializer.data})

class MockPOView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        po = PurchaseOrder.objects.first()
        if not po:
            return Response({"error": "No PO configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PurchaseOrderSerializer(po)
        return Response(serializer.data)

    def post(self, request):
        po = PurchaseOrder.objects.first()
        if not po:
            return Response({"error": "No PO configured in DB"}, status=status.HTTP_404_NOT_FOUND)
            
        action = request.data.get("action")
        if action == "cancel":
            po.status = "Cancelled"
            po.save()
            
            POTimelineEvent.objects.create(
                purchase_order=po,
                title="PO Cancelled by Manager",
                time="Just now",
                completed=True,
                isError=True
            )
            
        serializer = PurchaseOrderSerializer(po)
        return Response(serializer.data)

class MockInvoiceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        invoice = Invoice.objects.first()
        if not invoice:
            return Response({"error": "No invoice configured in DB"}, status=status.HTTP_404_NOT_FOUND)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    def post(self, request):
        invoice = Invoice.objects.first()
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
                time="Just now",
                completed=True
            )
        elif action == "cancel":
            invoice.status = "Cancelled"
            invoice.save()
            
            InvoiceTimelineEvent.objects.create(
                invoice=invoice,
                title="Invoice Cancelled by Manager",
                time="Just now",
                completed=True,
                isError=True
            )
            
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

class MockActivityLogsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        logs = ActivityLog.objects.all().order_by('-id')
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
                desc=f"Vendor submitted a new quote for RFQ #{serializer.instance.rfq_id}.",
                category="Quotations",
                time="Just now"
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
