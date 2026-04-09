from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, time, timedelta
from .models import TimeSlot
from .serializers import TimeSlotSerializer
from hospital_management.apps.doctors.models import Doctor

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    
    def get_queryset(self):
        queryset = TimeSlot.objects.all()
        doctor_id = self.request.query_params.get('doctor_id')
        date = self.request.query_params.get('date')
        available = self.request.query_params.get('available')
        
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if date:
            queryset = queryset.filter(date=date)
        if available:
            queryset = queryset.filter(is_available=available.lower() == 'true')
            
        return queryset
    
    @action(detail=False, methods=['post'])
    def generate_slots(self, request):
        """Generate time slots for a doctor on specific dates"""
        doctor_id = request.data.get('doctor_id')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        slot_duration = request.data.get('slot_duration', 30)  # minutes
        working_hours_start = request.data.get('working_hours_start', '09:00')
        working_hours_end = request.data.get('working_hours_end', '17:00')
        
        if not all([doctor_id, start_date, end_date]):
            return Response({'error': 'doctor_id, start_date, and end_date are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        try:
            doctor = Doctor.objects.get(id=doctor_id)
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            start_time = datetime.strptime(working_hours_start, '%H:%M').time()
            end_time = datetime.strptime(working_hours_end, '%H:%M').time()
        except (Doctor.DoesNotExist, ValueError):
            return Response({'error': 'Invalid doctor_id or date format'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        created_slots = []
        current_date = start_date_obj
        
        while current_date <= end_date_obj:
            current_time = start_time
            while current_time < end_time:
                end_slot_time = (datetime.combine(current_date, current_time) + 
                               timedelta(minutes=slot_duration)).time()
                
                if end_slot_time <= end_time:
                    slot, created = TimeSlot.objects.get_or_create(
                        doctor=doctor,
                        date=current_date,
                        start_time=current_time,
                        defaults={'end_time': end_slot_time, 'is_available': True}
                    )
                    if created:
                        created_slots.append(slot)
                
                current_time = end_slot_time
            
            current_date += timedelta(days=1)
        
        serializer = self.get_serializer(created_slots, many=True)
        return Response({
            'message': f'Created {len(created_slots)} time slots',
            'slots': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def book_slot(self, request, pk=None):
        """Book a time slot (mark as unavailable)"""
        slot = self.get_object()
        if not slot.is_available:
            return Response({'error': 'Time slot is not available'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        slot.is_available = False
        slot.save()
        return Response({'message': 'Time slot booked successfully'})
    
    @action(detail=True, methods=['post'])
    def release_slot(self, request, pk=None):
        """Release a time slot (mark as available)"""
        slot = self.get_object()
        slot.is_available = True
        slot.save()
        return Response({'message': 'Time slot released successfully'})
