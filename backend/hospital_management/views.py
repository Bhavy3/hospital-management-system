from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        "message": "Hospital Management System API",
        "status": "ok",
        "endpoints": [
            "/admin/",
            "/api/token/",
            "/api/token/refresh/",
            "/api/users/",
            "/api/patients/",
            "/api/doctors/",
            "/api/appointments/",
            "/api/prescriptions/",
            "/api/billing/",
            "/api/rooms/",
            "/api/reports/",
            "/api/staff/",
        ],
    })
