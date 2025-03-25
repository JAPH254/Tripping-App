from rest_framework import generics
from .models import Trip
from .serializers import TripSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geopy.distance import geodesic
from rest_framework import viewsets
from .models import ELDLog
from .serializers import ELDLogSerializer
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import HttpResponse
class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

@api_view(['POST'])
def get_route(request):
    pickup = request.data.get("pickup")
    dropoff = request.data.get("dropoff")

    if not pickup or not dropoff:
        return Response({"error": "Pickup and dropoff required"}, status=400)

    # Calculate distance
    distance = geodesic((pickup["lat"], pickup["lng"]), (dropoff["lat"], dropoff["lng"])).miles

    return Response({"distance": distance, "route": [pickup, dropoff]})


class ELDLogViewSet(viewsets.ModelViewSet):
    queryset = ELDLog.objects.all()
    serializer_class = ELDLogSerializer

def generate_eld_pdf(request, log_id):
    log = ELDLog.objects.get(id=log_id)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="eld_log_{log.id}.pdf"'

    p = canvas.Canvas(response, pagesize=letter)
    p.drawString(100, 750, f"ELD Log Sheet - {log.driver_name}")
    p.drawString(100, 730, f"Date: {log.date}")
    p.drawString(100, 710, f"Driving Hours: {log.driving_hours}")
    p.drawString(100, 690, f"Rest Hours: {log.rest_hours}")
    p.drawString(100, 670, f"Location: {log.location}")

    p.showPage()
    p.save()
    return response