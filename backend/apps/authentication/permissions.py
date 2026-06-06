from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Allows access only to users with the Admin role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Admin')

class IsProcurementOfficerRole(BasePermission):
    """
    Allows access only to users with the Procurement Officer role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Procurement Officer')

class IsVendorRole(BasePermission):
    """
    Allows access only to users with the Vendor role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Vendor')

class IsManagerRole(BasePermission):
    """
    Allows access only to users with the Manager role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Manager')
