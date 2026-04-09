from django.db import models

class Room(models.Model):
    ROOM_TYPES = (
        ('General', 'General'),
        ('Private', 'Private'),
        ('ICU', 'ICU'),
        ('OT', 'Operation Theatre'),
    )
    
    room_no = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    # "availability" can be derived or stored. Prompt says "Room_availability (Varchar)"
    is_available = models.BooleanField(default=True)
    charges = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.room_no} - {self.room_type}"
