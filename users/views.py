from cities_light.models import City
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import User
from django.views.generic import CreateView, TemplateView
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
            serializer.save() 
            
            return Response(
                {"message": "Twój email został pomyślnie zaktualizowany!", "email": user.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"], name="Change Username")
    def change_username(self, request, pk=None):
        user = request.user
        serializer = ChangeUsernameSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": 'Zmiana nazwy użytkownika przebiegła pomyślnie', "email": user.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["put"], name="Change Password")
    def change_password(self, request, pk=None):
        user = request.user
        serializer = ChangePasswordSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": 'Twoje hasło zostało zmienione', "email": user.email}, 
                status=status.HTTP_200_OK
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


def get_city(request):
    region_id = request.GET.get('region_id')
    if region_id:
        city = City.objects.filter(region_id=region_id).order_by('name').values('id', 'name')
        return JsonResponse(list(city), safe=False)
    return JsonResponse([], safe=False)


