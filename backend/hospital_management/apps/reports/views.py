from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from hospital_management.apps.patients.models import Patient
from hospital_management.apps.doctors.models import Doctor
from hospital_management.apps.appointments.models import Appointment
from hospital_management.apps.billing.models import Payment
from django.db.models import Sum
from hospital_management.apps.rooms.models import Room

class DashboardStatsView(APIView):
    def get(self, request):
        today = timezone.now().date()
        
        # Core Stats
        total_patients = Patient.objects.count()
        active_doctors = Doctor.objects.filter(availability_status='Available').count()
        total_doctors = Doctor.objects.count()
        appointments_today = Appointment.objects.filter(date=today).count()
        revenue_today = Payment.objects.filter(date=today).aggregate(Sum('amount'))['amount__sum'] or 0
        
        # System Health (Real Bed Occupancy)
        total_rooms = Room.objects.count()
        occupied_rooms = Room.objects.filter(is_available=False).count()
        occupancy_rate = (occupied_rooms / total_rooms * 100) if total_rooms > 0 else 0
        
        # Recent Activity (Aggregated)
        recent_patients = Patient.objects.order_by('-id')[:3]
        recent_payments = Payment.objects.order_by('-id')[:3]
        
        activity = []
        for p in recent_patients:
            activity.append({
                "user": "Receptionist",
                "act": f"Registered new patient: {p.name}",
                "time": "Just now",
                "type": "Patient"
            })
        for pay in recent_payments:
            activity.append({
                "user": "System",
                "act": f"Processed ${pay.amount} payment",
                "time": "Today",
                "type": "Finance"
            })

        data = {
            "total_patients": { "value": total_patients, "trend": "+12%" },
            "active_doctors": { "value": active_doctors, "total": total_doctors, "trend": "+2" },
            "appointments_today": { "value": appointments_today, "trend": "Live" },
            "revenue_today": { "value": float(revenue_today), "trend": "+18%" },
            "system_health": {
                "occupancy": round(occupancy_rate, 1),
                "total_rooms": total_rooms,
                "occupied_rooms": occupied_rooms
            },
            "recent_activity": activity[:5] # Top 5
        }
        
        return Response(data)
