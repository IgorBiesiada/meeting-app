from django.urls import path
from user_profile.views import ChangeEmailView, ChangeUsernameView, UserProfileView, ChangePasswordView

app_name = 'user_profile'

urlpatterns = [
    path('<int:pk>/change_mail/', ChangeEmailView.as_view(), name='change_mail'),
    path('<int:pk>/change_username/', ChangeUsernameView.as_view(), name='change_username'),
    path('<int:pk>/user_profile/', UserProfileView.as_view(), name='user_profile'),
    path('<int:pk>/change_password/', ChangePasswordView.as_view(), name='change_password')
]
