from rest_framework import serializers
from hospital_management.apps.billing.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
