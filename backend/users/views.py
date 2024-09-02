# backend/users/views.py
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics, status, permissions
from .serializers import UserSerializer, PasswordResetSerializer
from rest_framework.permissions import IsAdminUser
from .models import CustomUser
from rest_framework.authtoken.models import Token

User = get_user_model()

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            # Include user role in the response
            return Response({
                'message': 'Login successful',
                'user': {
                    'username': user.username,
                    'role': user.role  # Ensure 'role' is a field on your user model
                },
                'token': token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = get_object_or_404(User, email=email)
            token = default_token_generator.make_token(user)
            reset_url = f"http://localhost:3000/reset-password-confirm/{user.pk}/{token}/"

            send_mail(
                'Password Reset Request',
                f'Click the link below to reset your password:\n{reset_url}',
                'proryder500@gmail.com',  # Replace with your configured email address
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email has been sent.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token, *args, **kwargs):
        user = get_object_or_404(User, pk=uid)
        if default_token_generator.check_token(user, token):
            password = request.data.get('password')
            user.set_password(password)
            user.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid token or user ID'}, status=status.HTTP_400_BAD_REQUEST)

# View for an admin to update the user role
class UpdateUserRoleView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Only admins can update roles
    lookup_field = 'id'

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] 