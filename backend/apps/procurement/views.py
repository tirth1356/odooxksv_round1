from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class MockDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "kpis": {
                "active_rfqs": 12,
                "pending_approvals": 5,
                "pos_this_month": "$2.3L",
                "overdue_invoices": 3
            },
            "recent_purchase_orders": [
                {
                    "po_number": "Po1",
                    "vendor": "Infra Supplies Pvt Ltd",
                    "amount": 87000,
                    "status": "Approved"
                },
                {
                    "po_number": "Po2",
                    "vendor": "Techcore LTD",
                    "amount": 140000,
                    "status": "Pending"
                },
                {
                    "po_number": "Po3",
                    "vendor": "OfficeNeed Co",
                    "amount": 34900,
                    "status": "Draft"
                }
            ],
            "spending_trends": {
                "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                "amounts": [45000, 68000, 110000, 95000, 150000, 230000]
            }
        }
        return Response(data)
