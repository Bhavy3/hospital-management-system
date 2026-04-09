from rest_framework import serializers
from hospital_management.apps.appointments.models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    estimated_waiting_time = serializers.SerializerMethodField()
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'

    def get_estimated_waiting_time(self, obj):
        if obj.queue_status != 'Waiting':
            return 0
        
        # Count patients ahead in the queue for the same doctor
        patients_ahead = Appointment.objects.filter(
            doctor=obj.doctor,
            date=obj.date,
            queue_status='Waiting',
            arrival_time__lt=obj.arrival_time
        ).count()

        # If anyone is currently In-Progress, they don't count towards 'Waiting' 
        # but their remaining time might matter. For simplicity:
        # waiting_time = (patients ahead) * average consultation time
        avg_time = obj.doctor.average_consultation_time
        return patients_ahead * avg_time
