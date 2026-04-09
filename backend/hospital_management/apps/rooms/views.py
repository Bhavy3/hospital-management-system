from rest_framework import viewsets
from hospital_management.apps.rooms.models import Room
from hospital_management.apps.rooms.serializers import RoomSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
