from django.urls import path, include
from users.views import  CustomTokenObtainPairView, UserViewSet, GitHubLoginView, DiscordLoginView
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
    path('api/auth/github/', GitHubLoginView.as_view(), name='github_login'),
    path('api/auth/discord/', DiscordLoginView.as_view(), name='discord_login'),
    path('api/', include(router.urls))
    ]
