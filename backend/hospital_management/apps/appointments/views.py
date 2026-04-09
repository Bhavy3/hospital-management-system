from rest_framework import viewsets
from hospital_management.apps.appointments.models import Appointment
from hospital_management.apps.appointments.serializers import AppointmentSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Appointment.objects.none()
            
        if user.role == 'admin' or user.role in ['staff', 'receptionist']:
            queryset = Appointment.objects.all()
        elif user.role == 'doctor':
            queryset = Appointment.objects.filter(doctor__user=user)
        elif user.role == 'patient':
            queryset = Appointment.objects.filter(patient__user=user)
        else:
            return Appointment.objects.none()

        patient_id = self.request.query_params.get('patient_id')
        if patient_id is not None:
            queryset = queryset.filter(patient_id=patient_id)
            
        doctor_id = self.request.query_params.get('doctor_id')
        if doctor_id is not None:
            queryset = queryset.filter(doctor_id=doctor_id)
            
        return queryset

    @action(detail=False, methods=['get'])
    def waiting_list(self, request):
        user = request.user
        queryset = self.get_queryset()
        
        # Filter for today and waiting/in-progress
        today = timezone.now().date()
        appointments = queryset.filter(
            date=today,
            queue_status__in=['Waiting', 'In-Progress']
        ).order_by('arrival_time')
        
        # If today is empty, check if we should show any 'Waiting' regardless of date
        # (Useful for early/late appointments or timezone issues)
        if not appointments.exists():
            appointments = queryset.filter(
                queue_status='Waiting'
            ).order_by('date', 'arrival_time')[:5] # Show next 5 pending

        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_consultation(self, request, pk=None):
        appointment = self.get_object()
        appointment.queue_status = 'In-Progress'
        appointment.save()
        
        # Update doctor status
        doctor = appointment.doctor
        doctor.availability_status = 'Busy'
        doctor.save()
        
        return Response({'status': 'consultation started'})

    @action(detail=True, methods=['post'])
    def complete_consultation(self, request, pk=None):
        appointment = self.get_object()
        appointment.queue_status = 'Completed'
        appointment.status = 'Completed'
        appointment.save()
        
        # Update doctor status back to Available if no one else is waiting?
        # For now, just set to Available.
        doctor = appointment.doctor
        doctor.availability_status = 'Available'
        doctor.save()
        
        return Response({'status': 'consultation completed'})

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Confirmed'
        appointment.save()
        return Response({'status': 'appointment confirmed'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        return Response({'status': 'appointment cancelled'})
