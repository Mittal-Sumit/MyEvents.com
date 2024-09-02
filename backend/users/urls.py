# backend/users/urls.py
from django.urls import path
from .views import UserCreate, LoginView, ResetPasswordView, ResetPasswordConfirmView, UpdateUserRoleView, UserListView

urlpatterns = [
    path('register/', UserCreate.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset_password/', ResetPasswordView.as_view(), name='reset_password'),
    path('reset_password_confirm/<int:uid>/<str:token>/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),
    path('update-role/<int:user_id>/', UpdateUserRoleView.as_view(), name='update-user-role'),
    path('update-role/<int:id>/', UpdateUserRoleView.as_view(), name='update-role'),
    path('', UserListView.as_view(), name='user-list'),
]

