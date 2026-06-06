from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

# In-memory store to mock database records during server session
MOCK_RFQS_DATABASE = [
    {
        "id": 1,
        "title": "Office Furniture procurement Q2",
        "category": "Furniture",
        "deadline": "2026-06-15",
        "description": "Ergonomic chairs and standing desks for 3rd floor",
        "status": "Open",
        "line_items": [
            {"item": "Ergonomic chair", "qty": 25, "unit": "NOS"},
            {"item": "Standing desks", "qty": 10, "unit": "NOS"}
        ],
        "assigned_vendors": ["Infra Supplies Pvt Ltd", "Techcore LTD"]
    }
]

class MockRFQView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(MOCK_RFQS_DATABASE)

    def post(self, request):
        data = request.data
        
        title = data.get("title")
        category = data.get("category")
        deadline = data.get("deadline")
        
        if not title or not category or not deadline:
            return Response(
                {"error": "RFQ's title, category and deadline are required fields"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        new_id = len(MOCK_RFQS_DATABASE) + 1
        new_rfq = {
            "id": new_id,
            "title": title,
            "category": category,
            "deadline": deadline,
            "description": data.get("description", ""),
            "status": "Open",
            "line_items": data.get("line_items", []),
            "assigned_vendors": data.get("assigned_vendors", [])
        }
        
        MOCK_RFQS_DATABASE.append(new_rfq)
        
        return Response({
            "message": f"RFQ '{title}' created and published successfully (in-memory)",
            "rfq": new_rfq
        }, status=status.HTTP_201_CREATED)
