from django.db import models
from django.conf import settings

class Staff(models.Model):
    ROLE_CHOICES = (
        ('receptionist', 'Receptionist'),
        ('nurse', 'Nurse'),
        ('lab_tech', 'Lab Technician'),
        ('admin_staff', 'Administrative Staff'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff_profile')
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    mobile = models.CharField(max_length=15)
    email = models.EmailField()
    joining_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
