from django.db import models
from django.conf import settings

class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100) # Qualification/Dept
    mobile = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    address = models.TextField()
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    WORKING_STATUS_CHOICES = (
        ('Available', 'Available'),
        ('Busy', 'Busy'),
        ('Offline', 'Offline'),
    )
    
    availability_status = models.CharField(max_length=20, choices=WORKING_STATUS_CHOICES, default='Offline')
    average_consultation_time = models.IntegerField(default=15, help_text="Average time per patient in minutes")
    working_time = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Dr. {self.name} ({self.specialization})"
