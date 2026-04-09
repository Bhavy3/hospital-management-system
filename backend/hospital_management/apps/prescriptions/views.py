from rest_framework import viewsets
from hospital_management.apps.prescriptions.models import Prescription
from hospital_management.apps.prescriptions.serializers import PrescriptionSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Prescription.objects.none()
            
        if user.role in ['admin', 'staff', 'receptionist']:
            return Prescription.objects.all()
        elif user.role == 'patient':
            return Prescription.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return Prescription.objects.filter(doctor__user=user)
        return Prescription.objects.none()
