from django.urls import path, include
from rest_framework.routers import SimpleRouter
from hospital_management.apps.appointments.views import AppointmentViewSet

router = SimpleRouter()
router.register(r'', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]
