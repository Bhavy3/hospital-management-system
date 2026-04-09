from rest_framework import serializers
from .models import TimeSlot

class TimeSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'doctor', 'doctor_name', 'date', 'start_time', 'end_time', 
            'is_available', 'duration_minutes'
        ]
        read_only_fields = ['duration_minutes']