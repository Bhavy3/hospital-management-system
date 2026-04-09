from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from hospital_management.apps.users.views import CustomTokenObtainPairView
from hospital_management.views import api_root

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/users/', include('hospital_management.apps.users.urls')), # Placeholder if needed
    path('api/patients/', include('hospital_management.apps.patients.urls')),
    path('api/doctors/', include('hospital_management.apps.doctors.urls')),
    path('api/appointments/', include('hospital_management.apps.appointments.urls')),
    path('api/prescriptions/', include('hospital_management.apps.prescriptions.urls')),
    path('api/billing/', include('hospital_management.apps.billing.urls')),
    path('api/rooms/', include('hospital_management.apps.rooms.urls')),
    path('api/reports/', include('hospital_management.apps.reports.urls')),
    path('api/staff/', include('hospital_management.apps.staff.urls')),
    path('api/discharges/', include('hospital_management.apps.discharge.urls')),
    path('api/timeslots/', include('hospital_management.apps.timeslots.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
