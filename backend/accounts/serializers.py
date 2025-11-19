# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password # <--- این ایمپورت مهم است
from django.core import exceptions as django_exceptions

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name')

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("این ایمیل قبلاً ثبت شده است.")
        return value

    # --- اضافه کردن اعتبارسنجی پسورد ---
    def validate_password(self, value):
        try:
            # این تابع بر اساس تنظیمات settings.py جنگو چک می‌کند
            validate_password(value)
        except django_exceptions.ValidationError as e:
            # تبدیل خطای جنگو به خطای سریالایزر
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user