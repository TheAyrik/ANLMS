from django.contrib import admin

from neo_lms.utils.jalali import format_jalali

from .models import Course, Enrollment, Lesson, Module


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0


class ModuleInline(admin.StackedInline):
    model = Module
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'is_published', 'created_at_jalali')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'slug', 'instructor__username')
    prepopulated_fields = {'slug': ('title',)}
    inlines = (ModuleInline,)

    @admin.display(description="Created (Jalali)", ordering="created_at")
    def created_at_jalali(self, obj):
        return format_jalali(obj.created_at)


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    inlines = (LessonInline,)
    ordering = ('course', 'order')


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order', 'is_free')
    list_filter = ('module', 'is_free')
    ordering = ('module', 'order')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'enrolled_at_jalali')
    list_filter = ('course', 'enrolled_at')
    search_fields = ('user__username', 'course__title')

    @admin.display(description="Enrolled (Jalali)", ordering="enrolled_at")
    def enrolled_at_jalali(self, obj):
        return format_jalali(obj.enrolled_at)
