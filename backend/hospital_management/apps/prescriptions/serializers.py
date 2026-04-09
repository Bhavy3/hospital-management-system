from rest_framework import serializers
from hospital_management.apps.prescriptions.models import Prescription

class PrescriptionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = Prescription
        fields = '__all__'
