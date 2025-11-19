"""
URL configuration for neo_lms project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

from accounts.views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
    UserMeView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # APIهای احراز هویت (Login & Refresh)
    path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/logout/', LogoutView.as_view(), name='logout'),
    path('api/users/me/', UserMeView.as_view(), name='user_me'),

    # APIهای حساب کاربری (Register)
    path('api/accounts/', include('accounts.urls')),  # <--- این خط اضافه شد
    path('api/courses/', include('courses.urls')),
]
