# backend/users/urls.py
from django.urls import path
from .views import (
    UserCreate, ResetPasswordView, ResetPasswordConfirmView,
    UpdateUserRoleView, UserListView, CustomTokenObtainPairView,
    UserProfileView, ChangePasswordView
)

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),  
    path('reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path('reset_password_confirm/<int:uid>/<str:token>/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
    path('update-role/<int:id>/', UpdateUserRoleView.as_view(), name='update-user-role'),
    path('', UserListView.as_view(), name='user-list'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]
