from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class MockVendorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        vendors = [
            {
                "id": 1,
                "vendor_name": "Infra Supplies Pvt Ltd",
                "category": "Construction",
                "gst_no": "27AABCS1429Bz0",
                "contact_no": "+91-98765-43210",
                "status": "Active"
            },
            {
                "id": 2,
                "vendor_name": "Techcore LTD",
                "category": "IT",
                "gst_no": "27AABCS1429Bz0",
                "contact_no": "+91-98765-43211",
                "status": "Active"
            },
            {
                "id": 3,
                "vendor_name": "OfficeNeed Co",
                "category": "Furniture",
                "gst_no": "27AABCS1429Bz2",
                "contact_no": "+91-98765-43212",
                "status": "Pending"
            },
            {
                "id": 4,
                "vendor_name": "FastLog Transport",
                "category": "logistics",
                "gst_no": "27AABCS1429Bz0",
                "contact_no": "+91-98765-43213",
                "status": "Blocked"
            }
        ]

        # Handle tab filtering
        status_filter = request.query_params.get('status', '').strip().lower()
        if status_filter:
            if status_filter == 'active':
                vendors = [v for v in vendors if v['status'] == 'Active']
            elif status_filter == 'pending':
                vendors = [v for v in vendors if v['status'] == 'Pending']
            elif status_filter == 'blocked':
                vendors = [v for v in vendors if v['status'] == 'Blocked']

        # Handle search parameter
        search_query = request.query_params.get('search', '').strip().lower()
        if search_query:
            vendors = [
                v for v in vendors 
                if search_query in v['vendor_name'].lower() or search_query in v['category'].lower()
            ]

        return Response(vendors)
