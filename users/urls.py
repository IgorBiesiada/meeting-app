from django.urls import path
from users.views import RegisterUserView, CustomLoginUserView, HomeBeforeLoginView, LogoutUserView, get_city, BannedUsersView

app_name = 'users'

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomLoginUserView.as_view(), name='login'),
    path('', HomeBeforeLoginView.as_view(), name='landing_page'),
    path('banned/', BannedUsersView.as_view(), name='banned'),
    path('get_city/', get_city, name='get_city'),
    path('logout_redirect/', LogoutUserView.as_view(), name='logout_redirect')
]
