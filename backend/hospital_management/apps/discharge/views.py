from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from .models import Discharge
from .serializers import DischargeSerializer
from hospital_management.apps.patients.models import Patient
from hospital_management.apps.rooms.models import Room
from hospital_management.apps.billing.models import Payment

class DischargeViewSet(viewsets.ModelViewSet):
    queryset = Discharge.objects.all()
    serializer_class = DischargeSerializer
    
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Discharge.objects.none()
            
        if user.role in ['admin', 'staff', 'receptionist']:
            return Discharge.objects.all()
        elif user.role == 'patient':
            return Discharge.objects.filter(patient__user=user)
        return Discharge.objects.none()
    
    def perform_create(self, serializer):
        # Set the user who performed the discharge
        serializer.save(discharged_by=self.request.user)
        
        # Update patient status
        discharge = serializer.instance
        patient = discharge.patient
        patient.is_discharged = True
        patient.discharge_date = timezone.now()
        patient.save()
        
        # Free up the room if assigned
        room_charges = 0
        if patient.admitted_room:
            room = patient.admitted_room
            if patient.admission_date:
                days_admitted = (timezone.now() - patient.admission_date).days
                days_admitted = max(1, days_admitted)
                room_charges = room.charges * days_admitted
            
            room.is_available = True
            room.save()
        
        # Calculate total bill from payments + room charges
        payments_total = Payment.objects.filter(patient=patient).aggregate(
            total=models.Sum('amount')
        )['total'] or 0
        discharge.total_bill = payments_total + room_charges
        discharge.save()
    
    @action(detail=True, methods=['post'])
    def complete_payment(self, request, pk=None):
        discharge = self.get_object()
        discharge.payment_status = 'Paid'
        discharge.save()
        return Response({'status': 'Payment completed'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def mark_partial_payment(self, request, pk=None):
        discharge = self.get_object()
        discharge.payment_status = 'Partial'
        discharge.save()
        return Response({'status': 'Marked as partial payment'}, status=status.HTTP_200_OK)
