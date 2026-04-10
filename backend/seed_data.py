import os
import sys
import django
import random
from datetime import date, time

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

    # 2. Create Doctors (WITH USER LINK 🔥)
    doctors_data = [
        {'name': 'Sarah Smith', 'spec': 'Cardiology', 'fees': 500, 'email': 'sarah@hospital.com'},
        {'name': 'James Wilson', 'spec': 'Neurology', 'fees': 700, 'email': 'james@hospital.com'},
        {'name': 'Emily Davis', 'spec': 'Pediatrics', 'fees': 400, 'email': 'emily@hospital.com'},
    ]

    doctors = []

    for d in doctors_data:
        # 🔥 Create user
        user, _ = User.objects.get_or_create(
            email=d['email'],
            defaults={'username': d['email']}
        )
        user.set_password("123456")
        user.save()

        # 🔥 Link doctor with user
        doctor, _ = Doctor.objects.get_or_create(
            email=d['email'],
            defaults={
                'user': user,  # IMPORTANT FIX
                'name': d['name'],
                'specialization': d['spec'],
                'mobile': '9876543210',
                'address': 'Medical Plaza, Suite 101',
                'fees': d['fees'],
                'availability_status': 'Available'
            }
        )

        doctors.append(doctor)

    print("Doctors seeded.")

    # 3. Create Patients
    patients_data = [
        {'name': 'John Doe', 'gender': 'M'},
        {'name': 'Jane Watson', 'gender': 'F'},
        {'name': 'Robert Brown', 'gender': 'M'},
        {'name': 'Alice Johnson', 'gender': 'F'},
        {'name': 'Michael Scott', 'gender': 'M'},
    ]

    patients = []

    for p in patients_data:
        patient, _ = Patient.objects.get_or_create(
            name=p['name'],
            defaults={
                'gender': p['gender'],
                'mobile': '1234567890',
                'address': '123 Main St',
                'age': random.randint(20, 70)
            }
        )
        patients.append(patient)

    print("Patients seeded.")

    # 4. Create Rooms
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

    # 5. Create Appointments for today (FIXED 🔥)
    today = date.today()

    if patients and doctors:
        for doctor in doctors:  # 🔥 each doctor gets patients
            for i in range(3):
                Appointment.objects.create(
                    patient=random.choice(patients),
                    doctor=doctor,  # IMPORTANT FIX
                    date=today,
                    time=time(10, 0),  # FIXED TIME
                    reason="Regular Checkup",
                    priority="Normal",
                    queue_status="Waiting",
                    status="Scheduled"  # IMPORTANT FIX
                )

        print("Appointments today seeded.")

    # 6. Create Payments
    if patients:
        for i in range(2):
            Payment.objects.create(
                patient=random.choice(patients),
                amount=random.randint(500, 2000),
                payment_type='Cash',
                date=today,
                remarks="OPD Consultation Fee"
            )

        print("Payments today seeded.")


if __name__ == "__main__":
    seed()
