from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['user_id'] = self.user.id
        data['username'] = self.user.username
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'patient')
        )
        
        role = user.role
        if role == 'patient':
            from hospital_management.apps.patients.models import Patient
            Patient.objects.create(user=user, name=user.username, email=user.email, gender='O')
        elif role == 'doctor':
            from hospital_management.apps.doctors.models import Doctor
            Doctor.objects.create(user=user, name=user.username, email=user.email, specialization='General', address='Update Needed', fees=100.00, mobile='0000000000')
        elif role in ['staff', 'receptionist']:
            from hospital_management.apps.staff.models import Staff
            # Default staff role to 'admin_staff' if 'staff' is selected, otherwise 'receptionist'
            staff_role = 'receptionist' if role == 'receptionist' else 'admin_staff'
            Staff.objects.create(user=user, name=user.username, email=user.email, role=staff_role, mobile='TBD')
            
        return user

