from django.urls import path, include
from users.views import  HomeBeforeLoginView, LogoutUserView, get_city, BannedUsersView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


app_name = 'users'

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', HomeBeforeLoginView.as_view(), name='landing_page'),
    path('banned/', BannedUsersView.as_view(), name='banned'),
    path('get_city/', get_city, name='get_city'),
    path('logout_redirect/', LogoutUserView.as_view(), name='logout_redirect')
]
