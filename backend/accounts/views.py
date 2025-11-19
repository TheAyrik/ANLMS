from typing import Optional

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import UserRegistrationSerializer, UserSerializer


def _set_cookie(response, key: str, value: str, max_age: int):
    response.set_cookie(
        key,
        value,
        max_age=max_age,
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        domain=settings.AUTH_COOKIE_DOMAIN,
        path=settings.AUTH_COOKIE_PATH,
    )


def _attach_tokens(response: Response, access: str, refresh: Optional[str] = None):
    _set_cookie(
        response,
        settings.AUTH_COOKIE_ACCESS,
        access,
        settings.AUTH_COOKIE_ACCESS_MAX_AGE,
    )
    if refresh:
        _set_cookie(
            response,
            settings.AUTH_COOKIE_REFRESH,
            refresh,
            settings.AUTH_COOKIE_REFRESH_MAX_AGE,
        )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer


class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = str(serializer.validated_data['access'])
        refresh = str(serializer.validated_data['refresh'])

        response = Response({'detail': 'ورود با موفقیت انجام شد.'}, status=status.HTTP_200_OK)
        _attach_tokens(response, access, refresh)
        return response


class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)
        if refresh is None:
            return Response({'detail': 'توکن رفرش یافت نشد.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = self.get_serializer(data={'refresh': refresh})
        serializer.is_valid(raise_exception=True)
        access = str(serializer.validated_data['access'])
        new_refresh = serializer.validated_data.get('refresh')
        refresh_to_set = str(new_refresh) if new_refresh else refresh

        response = Response({'detail': 'توکن جدید صادر شد.'}, status=status.HTTP_200_OK)
        _attach_tokens(response, access, refresh_to_set)
        return response


class LogoutView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        response = Response({'detail': 'با موفقیت خارج شدید.'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.AUTH_COOKIE_ACCESS, path=settings.AUTH_COOKIE_PATH, domain=settings.AUTH_COOKIE_DOMAIN)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH, path=settings.AUTH_COOKIE_PATH, domain=settings.AUTH_COOKIE_DOMAIN)
        return response


class UserMeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user
