from rest_framework import viewsets
from hospital_management.apps.doctors.models import Doctor
from hospital_management.apps.doctors.serializers import DoctorSerializer
from hospital_management.mixins import ProfileMeMixin
from hospital_management.permissions import IsStaffOrAdmin

class DoctorViewSet(ProfileMeMixin, viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'doctor':
                return Doctor.objects.filter(user=user)
            # Staff can see all doctors
            return Doctor.objects.all()
        return Doctor.objects.none()
