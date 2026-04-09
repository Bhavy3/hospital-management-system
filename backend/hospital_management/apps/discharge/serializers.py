from rest_framework import serializers
from .models import Discharge

class DischargeSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    room_no = serializers.CharField(source='room.room_no', read_only=True)
    discharged_by_name = serializers.CharField(source='discharged_by.username', read_only=True)
    
    class Meta:
        model = Discharge
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name', 
            'room', 'room_no', 'discharge_date', 'discharge_reason', 
            'discharge_summary', 'follow_up_instructions', 'discharged_by', 
            'discharged_by_name', 'total_bill', 'payment_status'
        ]
        read_only_fields = ['discharge_date', 'discharged_by_name']