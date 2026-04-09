from django.db import models
from django.conf import settings

class Discharge(models.Model):
    DISCHARGE_REASONS = (
        ('Recovered', 'Recovered'),
        ('Transferred', 'Transferred to another facility'),
        ('Against Medical Advice', 'Against Medical Advice'),
        ('Deceased', 'Deceased'),
        ('Other', 'Other'),
    )
    
    patient = models.OneToOneField('patients.Patient', on_delete=models.CASCADE, related_name='discharge')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.SET_NULL, null=True, related_name='discharges')
    room = models.ForeignKey('rooms.Room', on_delete=models.SET_NULL, null=True, related_name='discharges')
    
    discharge_date = models.DateTimeField(auto_now_add=True)
    discharge_reason = models.CharField(max_length=50, choices=DISCHARGE_REASONS, default='Recovered')
    discharge_summary = models.TextField(blank=True, help_text="Medical summary of the patient's condition at discharge")
    follow_up_instructions = models.TextField(blank=True, help_text="Instructions for follow-up care")
    
    discharged_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='discharges_performed')
    
    total_bill = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_status = models.CharField(max_length=20, choices=[
        ('Pending', 'Pending'),
        ('Paid', 'Paid'),
        ('Partial', 'Partial Payment'),
    ], default='Pending')
    
    def __str__(self):
        return f"Discharge for {self.patient.name} on {self.discharge_date.date()}"
    
    class Meta:
        ordering = ['-discharge_date']
