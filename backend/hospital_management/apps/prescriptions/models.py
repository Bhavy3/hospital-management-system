from django.db import models

class Prescription(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE)
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE)
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    medicine = models.TextField(help_text="Medicine name and dosage")
    description = models.TextField(blank=True, help_text="Additional instructions")

    def __str__(self):
        return f"Prescription for {self.patient.name} by {self.doctor.name}"
