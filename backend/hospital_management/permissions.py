from rest_framework import permissions

class IsStaffOrAdmin(permissions.BasePermission):
    """
    Allows access only to staff or admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role in ['admin', 'staff', 'receptionist'])

class IsDoctor(permissions.BasePermission):
    """
    Allows access only to doctors.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role == 'doctor')

class IsPatient(permissions.BasePermission):
    """
    Allows access only to patients.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and 
                   request.user.role == 'patient')

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object (or staff) to access it.
    Assumes the model has a 'user' or 'patient.user' field.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'staff', 'receptionist']:
            return True
        
        # Check if obj has user attribute directly
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if obj is a patient
        if hasattr(obj, 'patient'):
            return obj.patient.user == request.user
            
        return False
