from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.permissions import IsInstructorOrAdminRole
from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        base_qs = Course.objects.select_related('instructor').prefetch_related(
            'modules__lessons'
        )
        user = getattr(self.request, 'user', None)
        if user and user.is_authenticated and getattr(user, 'role', None) == user.Roles.ADMIN:
            return base_qs
        if user and user.is_authenticated and getattr(user, 'role', None) == user.Roles.INSTRUCTOR:
            return base_qs.filter(Q(is_published=True) | Q(instructor=user))
        return base_qs.filter(is_published=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            permission_classes = [IsAuthenticated, IsInstructorOrAdminRole]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """
        Set the instructor to the current user for new courses.
        """
        serializer.save(instructor=self.request.user)
