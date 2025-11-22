from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = "student", "Student"
        INSTRUCTOR = "instructor", "Instructor"
        ADMIN = "admin", "Admin"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.STUDENT,
    )

    @property
    def is_student(self) -> bool:
        return self.role == self.Roles.STUDENT

    @property
    def is_instructor(self) -> bool:
        return self.role == self.Roles.INSTRUCTOR

    @property
    def is_admin(self) -> bool:
        return self.role == self.Roles.ADMIN
