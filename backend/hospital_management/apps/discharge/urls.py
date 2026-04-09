from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import DischargeViewSet

router = SimpleRouter()
router.register(r'', DischargeViewSet, basename='discharge')

urlpatterns = [
    path('', include(router.urls)),
]