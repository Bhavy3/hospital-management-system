from django.urls import path
from hospital_management.apps.users.views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
]

