from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser

from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        base_qs = Course.objects.select_related('instructor').prefetch_related(
            'modules__lessons'
        )
        user = getattr(self.request, 'user', None)
        if user and user.is_staff:
            return base_qs
        return base_qs.filter(is_published=True)

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
