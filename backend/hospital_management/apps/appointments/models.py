from django.db import models

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )
    
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()
    QUEUE_STATUS_CHOICES = (
        ('Waiting', 'Waiting'),
        ('In-Progress', 'In-Progress'),
        ('Completed', 'Completed'),
        ('Skipped', 'Skipped'),
    )
    PRIORITY_CHOICES = (
        ('Normal', 'Normal'),
        ('Urgent', 'Urgent'),
        ('Emergency', 'Emergency'),
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    queue_status = models.CharField(max_length=20, choices=QUEUE_STATUS_CHOICES, default='Waiting')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Normal')
    arrival_time = models.DateTimeField(auto_now_add=True, null=True)
    reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient.name} with {self.doctor.name} on {self.date}"
