from rest_framework import serializers
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
    QuotationLineItem,
)


class ApprovalStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalStep
        fields = ['id', 'approver', 'name', 'role', 'status', 'info']


class ApprovalSerializer(serializers.ModelSerializer):
    approval_chain = ApprovalStepSerializer(many=True, read_only=True)
    rfq_title = serializers.CharField(source='quotation.rfq.title', read_only=True)
    vendor = serializers.CharField(source='quotation.vendor.vendor_name', read_only=True)
    amount = serializers.DecimalField(source='quotation.total_price', max_digits=12, decimal_places=2, read_only=True)
    delivery_days = serializers.IntegerField(source='quotation.delivery_days', read_only=True)
    rating = serializers.DecimalField(source='quotation.vendor.rating', max_digits=3, decimal_places=2, read_only=True)

    class Meta:
        model = Approval
        fields = [
            'id', 'rfq_title', 'vendor', 'amount', 'delivery_days',
            'rating', 'status', 'remarks', 'created_at', 'processed_at',
            'approval_chain',
        ]


class POItemSerializer(serializers.ModelSerializer):
    # Keep 'desc' key for frontend compatibility
    desc = serializers.CharField(source='description')

    class Meta:
        model = POItem
        fields = ['desc', 'qty', 'price', 'total']


class POTimelineEventSerializer(serializers.ModelSerializer):
    # Map 'timestamp' → 'time' for frontend compatibility
    time = serializers.DateTimeField(source='timestamp', format='%d %b, %Y %H:%M')
    isError = serializers.BooleanField(source='is_error')

    class Meta:
        model = POTimelineEvent
        fields = ['id', 'title', 'time', 'completed', 'isError']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = POItemSerializer(many=True, read_only=True)
    timeline = POTimelineEventSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)
    # Format dates for frontend display
    date = serializers.DateField(format='%d %b, %Y')
    delivery_date = serializers.DateField(format='%d %b, %Y')
    # Format decimals as currency strings for frontend
    subtotal = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrder
        fields = [
            'po_number', 'vendor_name', 'date', 'delivery_date',
            'status', 'subtotal', 'grand_total', 'items', 'timeline',
        ]

    def get_subtotal(self, obj):
        return f"₹ {obj.subtotal:,.0f}"

    def get_grand_total(self, obj):
        return f"₹ {obj.grand_total:,.0f}"


class InvoiceItemSerializer(serializers.ModelSerializer):
    desc = serializers.CharField(source='description')

    class Meta:
        model = InvoiceItem
        fields = ['desc', 'qty', 'price', 'total']


class InvoiceTimelineEventSerializer(serializers.ModelSerializer):
    time = serializers.DateTimeField(source='timestamp', format='%d %b, %Y %H:%M')
    isError = serializers.BooleanField(source='is_error')

    class Meta:
        model = InvoiceTimelineEvent
        fields = ['id', 'title', 'time', 'completed', 'isError']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    timeline = InvoiceTimelineEventSerializer(many=True, read_only=True)
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)
    date = serializers.DateField(format='%d %b, %Y')
    due_date = serializers.DateField(format='%d %b, %Y')
    subtotal = serializers.SerializerMethodField()
    cgst = serializers.SerializerMethodField()
    sgst = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'invoice_number', 'vendor_name', 'date', 'due_date',
            'status', 'subtotal', 'cgst', 'sgst', 'grand_total',
            'items', 'timeline',
        ]

    def get_subtotal(self, obj):
        return f"₹ {obj.subtotal:,.0f}"

    def get_cgst(self, obj):
        return f"₹ {obj.cgst:,.0f}"

    def get_sgst(self, obj):
        return f"₹ {obj.sgst:,.0f}"

    def get_grand_total(self, obj):
        return f"₹ {obj.grand_total:,.0f}"


class ActivityLogSerializer(serializers.ModelSerializer):
    # Map new field names → old keys for frontend compatibility
    desc = serializers.CharField(source='description')
    time = serializers.SerializerMethodField()

    class Meta:
        model = ActivityLog
        fields = ['id', 'title', 'desc', 'category', 'time']

    def get_time(self, obj):
        """Convert timestamp to human-readable relative time for frontend."""
        from django.utils import timezone
        now = timezone.now()
        diff = now - obj.timestamp
        seconds = int(diff.total_seconds())

        if seconds < 60:
            return "Just now"
        elif seconds < 3600:
            minutes = seconds // 60
            return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
        elif seconds < 86400:
            hours = seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            days = seconds // 86400
            return f"{days} day{'s' if days > 1 else ''} ago"


class QuotationLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationLineItem
        fields = ['desc', 'qty', 'unit_price', 'delivery_days']


class QuotationSerializer(serializers.ModelSerializer):
    line_items = QuotationLineItemSerializer(many=True)

    class Meta:
        model = Quotation
        fields = ['id', 'rfq_id', 'tax_rate', 'validity', 'payment_terms', 'subtotal', 'gst_amount', 'grand_total', 'status', 'line_items']

    def create(self, validated_data):
        line_items_data = validated_data.pop('line_items', [])
        quotation = Quotation.objects.create(**validated_data)
        for item_data in line_items_data:
            QuotationLineItem.objects.create(quotation=quotation, **item_data)
        return quotation
