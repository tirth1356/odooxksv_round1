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
        fields = ['id', 'name', 'role', 'status', 'info']

class ApprovalSerializer(serializers.ModelSerializer):
    approval_chain = ApprovalStepSerializer(many=True, read_only=True)

    class Meta:
        model = Approval
        fields = ['id', 'rfq_title', 'vendor', 'amount', 'delivery_days', 'rating', 'status', 'remarks', 'approval_chain']

class POItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = POItem
        fields = ['desc', 'qty', 'price', 'total']

class POTimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = POTimelineEvent
        fields = ['id', 'title', 'time', 'completed', 'isError']

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = POItemSerializer(many=True, read_only=True)
    timeline = POTimelineEventSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ['po_number', 'vendor_name', 'date', 'delivery_date', 'status', 'subtotal', 'grand_total', 'items', 'timeline']

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['desc', 'qty', 'price', 'total']

class InvoiceTimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceTimelineEvent
        fields = ['id', 'title', 'time', 'completed', 'isError']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    timeline = InvoiceTimelineEventSerializer(many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = ['invoice_number', 'vendor_name', 'date', 'due_date', 'status', 'subtotal', 'cgst', 'sgst', 'grand_total', 'items', 'timeline']

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'title', 'desc', 'category', 'time']

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
