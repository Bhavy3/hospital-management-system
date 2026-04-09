import os
import sys
import django

# Add the project directory to sys.path for standalone execution
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "hospital_management.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'admin'
email = 'admin@example.com'
password = 'adminpassword'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password, role='admin')
    print(f"Superuser '{username}' created successfully.")
else:
    user = User.objects.get(username=username)
    user.role = 'admin'
    user.is_superuser = True
    user.is_staff = True
    user.set_password(password)
    user.save()
    print(f"User '{username}' already exists. Updated to admin superuser.")
