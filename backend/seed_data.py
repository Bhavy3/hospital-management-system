import os
import sys
import django
import random
from datetime import date, timedelta

# Add the project directory to sys.path for standalone execution
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hospital_management.settings")
django.setup()

from hospital_management.apps.doctors.models import Doctor
from hospital_management.apps.patients.models import Patient
from hospital_management.apps.rooms.models import Room
from hospital_management.apps.appointments.models import Appointment
from hospital_management.apps.billing.models import Payment
from hospital_management.apps.users.models import User
from hospital_management.apps.staff.models import Staff

def seed():
    # 1. Create Staff
    staff_data = [
        {'name': 'Nurse Joy', 'role': 'nurse', 'email': 'joy@hospital.com'},
        {'name': 'Receptionist Peter', 'role': 'receptionist', 'email': 'peter@hospital.com'},
        {'name': 'Technician Mark', 'role': 'lab_tech', 'email': 'mark@hospital.com'},
    ]
    for s in staff_data:
        Staff.objects.get_or_create(
            email=s['email'],
            defaults={
                'name': s['name'],
                'role': s['role'],
                'mobile': '0987654321',
                'joining_date': date.today()
            }
        )
    print("Staff seeded.")

    # 2. Create Doctors
    specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine']
    doctors_data = [
        {'name': 'Sarah Smith', 'spec': 'Cardiology', 'fees': 500, 'email': 'sarah@hospital.com'},
        {'name': 'James Wilson', 'spec': 'Neurology', 'fees': 700, 'email': 'james@hospital.com'},
        {'name': 'Emily Davis', 'spec': 'Pediatrics', 'fees': 400, 'email': 'emily@hospital.com'},
    ]
    
    for d in doctors_data:
        Doctor.objects.get_or_create(
            email=d['email'],
            defaults={
                'name': d['name'],
                'specialization': d['spec'],
                'mobile': '9876543210',
                'address': 'Medical Plaza, Suite 101',
                'fees': d['fees'],
                'availability_status': 'Available'
            }
        )
    print("Doctors seeded.")

    # 2. Create Patients
    patients_data = [
        {'name': 'John Doe', 'gender': 'M'},
        {'name': 'Jane Watson', 'gender': 'F'},
        {'name': 'Robert Brown', 'gender': 'M'},
        {'name': 'Alice Johnson', 'gender': 'F'},
        {'name': 'Michael Scott', 'gender': 'M'},
    ]
    
    for p in patients_data:
        Patient.objects.get_or_create(
            name=p['name'],
            defaults={
                'gender': p['gender'],
                'mobile': '1234567890',
                'address': '123 Main St',
                'age': random.randint(20, 70)
            }
        )
    print("Patients seeded.")

    # 3. Create Rooms
    rooms_data = [
        {'no': '101', 'type': 'General', 'charges': 1000},
        {'no': '201', 'type': 'Private', 'charges': 3000},
        {'no': 'ICU-1', 'type': 'ICU', 'charges': 8000},
    ]
    
    for r in rooms_data:
        Room.objects.get_or_create(
            room_no=r['no'],
            defaults={
                'room_type': r['type'],
                'charges': r['charges'],
                'is_available': True
            }
        )
    print("Rooms seeded.")

    # 4. Create some Appointments for today
    today = date.today()
    all_patients = list(Patient.objects.all())
    all_doctors = list(Doctor.objects.all())
    
    if all_patients and all_doctors:
        for i in range(3):
            Appointment.objects.create(
                patient=random.choice(all_patients),
                doctor=random.choice(all_doctors),
                date=today,
                time="10:00",
                reason="Regular Checkup",
                priority="Normal",
                queue_status="Waiting"
            )
        print("Appointments today seeded.")

    # 5. Create some Payments for today
    if all_patients:
        for i in range(2):
            Payment.objects.create(
                patient=random.choice(all_patients),
                amount=random.randint(500, 2000),
                payment_type='Cash',
                date=today,
                remarks="OPD Consultation Fee"
            )
        print("Payments today seeded.")

if __name__ == "__main__":
    seed()
