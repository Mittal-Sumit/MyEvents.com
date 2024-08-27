from django.shortcuts import render
# backend/users/views.py
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Create your views here.
