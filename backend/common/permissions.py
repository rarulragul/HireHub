from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to users with the ADMIN role or superusers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_superuser))


class IsRecruiterUserRole(permissions.BasePermission):
    """
    Allows access to users with the RECRUITER role or ADMIN.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('RECRUITER', 'ADMIN'))


class IsCandidateUserRole(permissions.BasePermission):
    """
    Allows access to users with the CANDIDATE role.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'CANDIDATE')


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'ADMIN' or request.user.is_superuser:
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'recruiter'):
            return obj.recruiter.user == request.user
        if hasattr(obj, 'candidate'):
            return obj.candidate.user == request.user
        return False
