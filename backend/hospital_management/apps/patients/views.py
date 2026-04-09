from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from hospital_management.apps.patients.models import Patient
from hospital_management.apps.patients.serializers import PatientSerializer
from hospital_management.apps.rooms.models import Room
from hospital_management.mixins import ProfileMeMixin
from hospital_management.permissions import IsStaffOrAdmin

class PatientViewSet(ProfileMeMixin, viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'patient':
                return Patient.objects.filter(user=user)
            # Staff and Doctors can see all patients
            return Patient.objects.all()
        return Patient.objects.none()

    @action(detail=True, methods=['post'])
    def admit(self, request, pk=None):
        patient = self.get_object()
        room_id = request.data.get('room_id')
        
        if not room_id:
            return Response({'error': 'room_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            room = Room.objects.get(id=room_id)
            if not room.is_available:
                return Response({'error': 'Room is not available'}, status=status.HTTP_400_BAD_REQUEST)
                
            patient.admitted_room = room
            patient.admission_date = timezone.now()
            patient.is_discharged = False
            patient.save()
            
            room.is_available = False
            room.save()
            
            return Response({'status': 'Patient admitted successfully'})
            
        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
