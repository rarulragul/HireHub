from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    ChangePasswordView,
    LogoutView,
    AdminUserListView,
    AdminUserStatusUpdateView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth-me'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth-change-password'),

    # Admin user management
    path('admin/users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('admin/users/<int:pk>/status/', AdminUserStatusUpdateView.as_view(), name='admin-user-status'),
]
