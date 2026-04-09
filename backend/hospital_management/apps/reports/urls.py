from django.urls import path
from hospital_management.apps.reports.views import DashboardStatsView

urlpatterns = [
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
]
