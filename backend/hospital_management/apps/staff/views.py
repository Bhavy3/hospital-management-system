from rest_framework import viewsets
from hospital_management.apps.staff.models import Staff
from hospital_management.apps.staff.serializers import StaffSerializer
from hospital_management.mixins import ProfileMeMixin
from hospital_management.permissions import IsStaffOrAdmin

class StaffViewSet(ProfileMeMixin, viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Staff.objects.none()
            
        if user.role == 'admin':
            return Staff.objects.all()
        elif user.role in ['staff', 'receptionist']:
            return Staff.objects.filter(user=user)
        return Staff.objects.none()
