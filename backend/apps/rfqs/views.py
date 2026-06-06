from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import RFQ
from .serializers import RFQSerializer

class MockRFQView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        rfqs = RFQ.objects.all()
        serializer = RFQSerializer(rfqs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RFQSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": f"RFQ '{serializer.instance.title}' created and published successfully",
                "rfq": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MockQuotationComparisonView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = [
            {
                "id": 1,
                "name": "Infra Supplies Pvt Ltd",
                "badge": "Lowest Price",
                "total": "₹ 87,000",
                "gst": "18%",
                "delivery": {
                    "text": "5 Days",
                    "tag": "Fastest",
                    "tagStyle": "bg-primary/10 text-primary border-primary/20"
                },
                "rating": "4.9",
                "terms": "Net 30",
                "compliance": True,
                "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCe_f7zRnJJKjQb6gDElTwIAt0Vl0wbj7lzUAhmIiZT5f2eokCgOHhdqJXXJPOrMQHtz9j5qKMT4CtjEt-8BRt-rp3gKoRB5JXDXgD097I7Pn3ss-NEuo-VbFIT6zF7zJ2qYDjWXtigFBRijbNa5dk0srz4aOrg1Tgg79tQ4di6drB2Qr7qTHhwSBaAW4wq4Skr2MeAsmcTSIWKsO4knRICDFsNn1OeU5OpEXtMsf-is0b_vDh5l00MfAdulMDyAeg5SBlc7xSIfFqp",
                "location": "Mumbai, India",
                "reliability": "98.2%",
                "prevPOs": "24 POs",
                "desc": "Leading corporate workspace suppliers with certified compliance and ISO ratings."
            },
            {
                "id": 2,
                "name": "Techcore LTD",
                "badge": "Recommended",
                "total": "₹ 94,500",
                "gst": "18%",
                "delivery": {
                    "text": "8 Days",
                    "tag": "Standard",
                    "tagStyle": "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30"
                },
                "rating": "4.6",
                "terms": "Net 15",
                "compliance": True,
                "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCe_f7zRnJJKjQb6gDElTwIAt0Vl0wbj7lzUAhmIiZT5f2eokCgOHhdqJXXJPOrMQHtz9j5qKMT4CtjEt-8BRt-rp3gKoRB5JXDXgD097I7Pn3ss-NEuo-VbFIT6zF7zJ2qYDjWXtigFBRijbNa5dk0srz4aOrg1Tgg79tQ4di6drB2Qr7qTHhwSBaAW4wq4Skr2MeAsmcTSIWKsO4knRICDFsNn1OeU5OpEXtMsf-is0b_vDh5l00MfAdulMDyAeg5SBlc7xSIfFqp",
                "location": "Bangalore, India",
                "reliability": "95.0%",
                "prevPOs": "12 POs",
                "desc": "IT workspace and infrastructure deployment partner with extensive service history."
            },
            {
                "id": 3,
                "name": "OfficeNeed Co",
                "badge": "",
                "total": "₹ 110,000",
                "gst": "12%",
                "delivery": {
                    "text": "12 Days",
                    "tag": "Late Delivery Risk",
                    "tagStyle": "bg-error-container/20 text-error border-error/20"
                },
                "rating": "4.2",
                "terms": "COD",
                "compliance": False,
                "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCe_f7zRnJJKjQb6gDElTwIAt0Vl0wbj7lzUAhmIiZT5f2eokCgOHhdqJXXJPOrMQHtz9j5qKMT4CtjEt-8BRt-rp3gKoRB5JXDXgD097I7Pn3ss-NEuo-VbFIT6zF7zJ2qYDjWXtigFBRijbNa5dk0srz4aOrg1Tgg79tQ4di6drB2Qr7qTHhwSBaAW4wq4Skr2MeAsmcTSIWKsO4knRICDFsNn1OeU5OpEXtMsf-is0b_vDh5l00MfAdulMDyAeg5SBlc7xSIfFqp",
                "location": "Delhi, India",
                "reliability": "89.4%",
                "prevPOs": "5 POs",
                "desc": "Local furniture distributor focusing on discount inventory and quick clearance."
            }
        ]
        return Response(data)
