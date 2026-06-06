from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import RFQ, Quotation
from .serializers import RFQSerializer, QuotationSerializer


class MockRFQView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        rfqs = RFQ.objects.prefetch_related('line_items', 'assigned_vendors', 'quotations').all()
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
        """Return all quotations for the first open RFQ, pulled from real DB data."""
        rfq = RFQ.objects.filter(status='Open').first()
        if not rfq:
            return Response([])

        quotations = Quotation.objects.select_related('vendor').filter(rfq=rfq)
        data = []
        for q in quotations:
            v = q.vendor
            # Determine badge based on position
            badge = ""
            lowest = quotations.order_by('total_price').first()
            if q.id == lowest.id:
                badge = "Lowest Price"

            # Determine delivery tag
            fastest = quotations.order_by('delivery_days').first()
            if q.id == fastest.id:
                delivery_tag = "Fastest"
                delivery_tag_style = "bg-primary/10 text-primary border-primary/20"
            elif q.delivery_days > 10:
                delivery_tag = "Late Delivery Risk"
                delivery_tag_style = "bg-error-container/20 text-error border-error/20"
            else:
                delivery_tag = "Standard"
                delivery_tag_style = "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/30"

            data.append({
                "id": q.id,
                "name": v.vendor_name,
                "badge": badge,
                "total": f"₹ {q.total_price:,.0f}",
                "gst": "18%",
                "delivery": {
                    "text": f"{q.delivery_days} Days",
                    "tag": delivery_tag,
                    "tagStyle": delivery_tag_style,
                },
                "rating": str(v.rating),
                "terms": "Net 30",
                "compliance": v.status == 'Active',
                "logo": "",
                "location": "India",
                "reliability": f"{float(v.rating) / 5.0 * 100:.1f}%",
                "prevPOs": f"{v.purchase_orders.count()} POs",
                "desc": q.vendor_notes or f"Vendor: {v.vendor_name}",
            })

        return Response(data)
