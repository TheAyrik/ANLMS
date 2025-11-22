# backend/accounts/serializers.py
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password  # <--- این ایمپورت مهم است
from django.core import exceptions as django_exceptions
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role')
        extra_kwargs = {
            'role': {'required': False},
        }

    def validate_email(self, value):
        normalized_email = value.strip().lower()
        if User.objects.filter(email__iexact=normalized_email).exists():
            raise serializers.ValidationError("این ایمیل قبلاً ثبت شده است.")
        return normalized_email

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
        role = validated_data.pop('role', User.Roles.STUDENT)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.role = role
        if user.role == User.Roles.ADMIN:
            user.is_staff = True
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')


class PersianTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'نام کاربری یا رمز عبور اشتباه است.'
    }


class PersianTokenRefreshSerializer(TokenRefreshSerializer):
    default_error_messages = {
        'token_not_valid': 'توکن شما منقضی شده یا معتبر نیست.'
    }
