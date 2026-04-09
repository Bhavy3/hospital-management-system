from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hospital_management.apps.prescriptions.views import PrescriptionViewSet

router = DefaultRouter()
router.register(r'', PrescriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
