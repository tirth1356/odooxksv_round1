from rest_framework import serializers
from .models import RFQ, RFQLineItem, Quotation
from apps.vendors.models import Vendor


class RFQLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RFQLineItem
        fields = ['id', 'item', 'qty', 'unit']


class QuotationSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.vendor_name', read_only=True)

    class Meta:
        model = Quotation
        fields = [
            'id', 'rfq', 'vendor', 'vendor_name', 'price_per_unit',
            'total_price', 'delivery_days', 'vendor_notes', 'status', 'submitted_at',
        ]
        read_only_fields = ['id', 'submitted_at']


class RFQSerializer(serializers.ModelSerializer):
    line_items = RFQLineItemSerializer(many=True)
    assigned_vendors = serializers.SerializerMethodField()
    quotations = QuotationSerializer(many=True, read_only=True)

    class Meta:
        model = RFQ
        fields = [
            'id', 'title', 'category', 'deadline', 'description',
            'status', 'created_by', 'created_at', 'line_items',
            'assigned_vendors', 'quotations',
        ]
        read_only_fields = ['id', 'created_at']

    def get_assigned_vendors(self, obj):
        return [v.vendor_name for v in obj.assigned_vendors.all()]

    def create(self, validated_data):
        line_items_data = validated_data.pop('line_items', [])
        raw_vendors = self.initial_data.get('assigned_vendors', [])

        rfq = RFQ.objects.create(**validated_data)

        for item_data in line_items_data:
            RFQLineItem.objects.create(rfq=rfq, **item_data)

        for vendor_name in raw_vendors:
            vendor, _ = Vendor.objects.get_or_create(
                vendor_name=vendor_name,
                defaults={'category': rfq.category, 'gst_no': '27AABCS1429Bz0', 'contact_no': '+91-98765-43210'}
            )
            rfq.assigned_vendors.add(vendor)

        return rfq
