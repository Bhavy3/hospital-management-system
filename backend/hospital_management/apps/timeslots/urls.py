from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import TimeSlotViewSet

router = SimpleRouter()
router.register(r'', TimeSlotViewSet, basename='timeslot')

urlpatterns = [
    path('', include(router.urls)),
]