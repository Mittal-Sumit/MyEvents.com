from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ADMIN = 'admin'
    USER = 'user'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (USER, 'User'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=USER)
