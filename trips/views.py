from rest_framework import generics
from .models import Trip
from .serializers import TripSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geopy.distance import geodesic
from rest_framework import viewsets
from .models import ELDLog, Route
from rest_framework.views import APIView
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

from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from .models import ELDLog

def generate_log_pdf(request, route_id):
    logs = ELDLog.objects.filter(route_id=route_id)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="log_sheet_{route_id}.pdf"'
    
    p = canvas.Canvas(response, pagesize=letter)

    for index, log in enumerate(logs):
        # Title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(200, 750, f"Daily Log Sheet - {log.date}")

        # Log Details
        p.setFont("Helvetica", 12)
        p.drawString(50, 700, f"Driving Hours: {log.driving_hours} hrs")
        p.drawString(50, 680, f"Rest Hours: {log.rest_hours} hrs")
        p.drawString(50, 660, f"Fuel Stops: {log.fuel_stops}")
        p.drawString(50, 640, f"Total Miles: {log.total_miles} mi")

        # Signature Area
        p.rect(50, 500, 400, 50)
        p.drawString(50, 510, "Driver Signature:")

        # Add new page for next log if multiple days
        if index < len(logs) - 1:
            p.showPage()

    p.save()
    return response


class RouteView(APIView):
    def post(self, request):
        route = Route.objects.create(**request.data)
        return Response({"message": "Route saved", "id": route.id})

    def get(self, request, route_id):
        route = Route.objects.get(id=route_id)
        return Response({"route": route.route, "stops": route.stops})
    
from rest_framework import generics, status
from rest_framework.response import Response
from django.http import HttpResponse
import csv
from .models import Route, Stop
from .serializers import RouteSerializer

class RouteListCreateView(generics.ListCreateAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

    def create(self, request, *args, **kwargs):
        """Handle route and stops creation"""
        data = request.data
        stops_data = data.pop('stops', [])

        # Create the Route entry
        route = Route.objects.create(**data)

        # Assign stops manually with incremental trip_stop_number (reset per trip)
        stops = [
            Stop(route=route, lat=stop["lat"], lng=stop["lng"], stop_type=stop["stop_type"], trip_stop_number=index + 1)
            for index, stop in enumerate(stops_data)
        ]
        Stop.objects.bulk_create(stops)  # Bulk insert for efficiency

        return Response(RouteSerializer(route).data, status=status.HTTP_201_CREATED)



class RouteDetailView(generics.RetrieveDestroyAPIView):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


class ExportRouteLogsView(generics.GenericAPIView):
    """Generate and download a CSV log sheet of the route and stops"""

    def get(self, request, route_id):
        try:
            route = Route.objects.get(id=route_id)
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="route_{route.id}_log.csv"'

            writer = csv.writer(response)
            writer.writerow(["Stop Type", "Latitude", "Longitude"])

            stops = Stop.objects.filter(route=route)
            for stop in stops:
                writer.writerow([stop.get_stop_type_display(), stop.lat, stop.lng])

            return response
        except Route.DoesNotExist:
            return Response({"error": "Route not found"}, status=status.HTTP_404_NOT_FOUND)
