from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Course, Enrollment, Lesson, Module


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            'id',
            'title',
            'content',
            'video_url',
            'duration',
            'is_free',
            'order',
        )


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = (
            'id',
            'title',
            'order',
            'lessons',
        )


class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.all()
    )
    instructor_name = serializers.SerializerMethodField()
    is_free = serializers.BooleanField(read_only=True)

    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'slug',
            'description',
            'price',
            'is_free',
            'image',
            'instructor',
            'instructor_name',
            'is_published',
            'created_at',
            'updated_at',
            'modules',
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_instructor_name(self, obj):
        return str(obj.instructor)


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'course', 'enrolled_at')
