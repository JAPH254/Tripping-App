from django.urls import path
from .views import TripListCreateView, get_route, ELDLogViewSet

urlpatterns = [
    path('trips/', TripListCreateView.as_view(), name='trip-list-create'),
    path('api/route/', get_route, name="get_route"),
    path('eld_logs/', ELDLogViewSet.as_view({'get': 'list', 'post': 'create'}), name='eldlog-list-create')
]
