from django.urls import path, include
from rest_framework.routers import SimpleRouter
from hospital_management.apps.patients.views import PatientViewSet

router = SimpleRouter()
router.register(r'', PatientViewSet, basename='patient')

urlpatterns = [
    path('', include(router.urls)),
]
