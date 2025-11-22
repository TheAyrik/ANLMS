from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission

User = get_user_model()


class IsAdminRole(BasePermission):
    """
    Allows access only to users with role='admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, 'role', None) == User.Roles.ADMIN
        )


class IsInstructorOrAdminRole(BasePermission):
    """
    Allows access to users with role='instructor' or role='admin'.
    """

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        return user.role in (User.Roles.INSTRUCTOR, User.Roles.ADMIN)
