from rest_framework import viewsets
from hospital_management.apps.billing.models import Payment
from hospital_management.apps.billing.serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Payment.objects.none()
            
        if user.role in ['admin', 'staff', 'receptionist']:
            return Payment.objects.all()
        elif user.role == 'patient':
            return Payment.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            # Doctors might need to see payments for their patients? 
            # For now, restrict to those they are assigned to.
            return Payment.objects.filter(patient__assigned_doctor__user=user)
        return Payment.objects.none()
