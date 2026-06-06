from rest_framework import serializers
from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'user', 'vendor_name', 'category', 'gst_no', 'contact_no', 'status', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at']
