from django.http import JsonResponse
from .models import User
from django.core.mail import send_mail
from config.settings import DEFAULT_FROM_EMAIL
from django.urls import reverse_lazy
from rest_framework import viewsets
from rest_framework.decorators import action
from users.serializers import UserSerializer, ChangeEmailSerializer, ChangeUsernameSerializer, ChangePasswordSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.discord.views import DiscordOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        user = serializer.save()
        email = user.email
#        send_mail(
#            'Let\'s meet',
#            'Witamy na pokładzie, życzymy miłych spotkań!',
#            DEFAULT_FROM_EMAIL, 
#            [email],
#            fail_silently=False
#        )

    @action(detail=False, methods=["put"], name="Change Email")
    def change_email(self, request, pk=None):
        user = request.user
        serializer = ChangeEmailSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            update_serializer = serializer.save() 
            
            return Response(
                {"message": "Twój email został pomyślnie zaktualizowany!", "email": update_serializer.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"], name="Change Username")
    def change_username(self, request, pk=None):
        user = request.user
        serializer = ChangeUsernameSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            update_serializer = serializer.save()

            return Response(
                {"message": 'Zmiana nazwy użytkownika przebiegła pomyślnie', "email": update_serializer.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"], name="Change Password")
    def change_password(self, request, pk=None):
        user = request.user
        serializer = ChangePasswordSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            update_serializer = serializer.save()

            return Response(
                {"message": 'Twoje hasło zostało zmienione', "email": update_serializer.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user

        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)

        elif request.method == 'PATCH':
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class GitHubLoginView(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "http://localhost:5173/oauth/github/callback"


class DiscordLoginView(SocialLoginView):
    adapter__class = DiscordOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "http://localhost:5173/oauth/discord/callback"
    