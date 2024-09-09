# backend/users/views.py
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.contrib.auth import update_session_auth_hash
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics, status, permissions
from .serializers import UserSerializer, PasswordResetSerializer,CustomTokenObtainPairSerializer
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        self.tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if self.tokens:
            response.data.update(self.tokens)
        return response

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
                'proryder500@gmail.com',
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

class UpdateUserRoleView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]  
    lookup_field = 'id'  

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect."}, status=400)

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Keep user logged in after password change
        return Response({"message": "Password updated successfully."})