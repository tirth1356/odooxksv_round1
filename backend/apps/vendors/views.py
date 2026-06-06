from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Q
from .models import Vendor
from .serializers import VendorSerializer

class MockVendorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        status_filter = request.query_params.get('status', '').strip().lower()
        vendors = Vendor.objects.all()
        
        if status_filter:
            if status_filter == 'active':
                vendors = vendors.filter(status='Active')
            elif status_filter == 'pending':
                vendors = vendors.filter(status='Pending')
            elif status_filter == 'blocked':
                vendors = vendors.filter(status='Blocked')

        search_query = request.query_params.get('search', '').strip()
        if search_query:
            vendors = vendors.filter(
                Q(vendor_name__icontains=search_query) | Q(category__icontains=search_query)
            )

        serializer = VendorSerializer(vendors, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VendorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
