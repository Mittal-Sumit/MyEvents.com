# backend/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser

class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff','role')
    list_filter = ('is_staff', 'is_superuser', 'is_active','role')
    search_fields = ('username', 'email')
    ordering = ('email',)

    # Add the 'role' field to the add/edit user form in the admin
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Role Information', {'fields': ('role',)}),  # Add this line
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'email', 'first_name', 'last_name', 'role'),  # Add 'role' here
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
