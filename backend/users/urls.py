from django.urls import path, include
from backend.users.views import  CustomTokenObtainPairView, UserViewSet
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenRefreshView
)

router = DefaultRouter()

app_name = 'users'

router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls))
    ]
