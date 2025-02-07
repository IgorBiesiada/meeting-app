"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LogoutView
from django.urls import path

from comments.views import AddCommentView
from home.views import HomeView
from meetings.views import MeetingListView, MeetingAddView, MeetingDetailView, MeetingUpdateView, DeleteMeetingView, UserMeetingListView, get_meeting_subregion, get_meeting_city, meetings_map_view
from users.views import (RegisterUserView, CustomLoginUserView, HomeBeforeLoginView, LogoutUserView, get_city)
from user_profile.views import ChangeEmailView, ChangeUsernameView, UserProfileView, ChangePasswordView
from participations.views import MeetingParticipationView
from payment.views import CreatePaymentView, PaymentCancelView, PaymentSuccessView
from user_messages.views import UserMessagesView, UserMessagesListView
from rating.views import RatingAddView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomLoginUserView.as_view(), name='login'),
    path('', HomeBeforeLoginView.as_view(), name='landing_page'),
    path('home/', HomeView.as_view(), name='home'),
    path('meetings/', MeetingListView.as_view(), name='meetings'),
    path('add_meeting/', MeetingAddView.as_view(), name='add_meeting'),
    path('<int:pk>/meeting_detail/', MeetingDetailView.as_view(), name='meeting_detail'),
    path('<int:pk>', MeetingUpdateView.as_view(), name='meeting_edit'),
    path('<int:pk>/delete/', DeleteMeetingView.as_view(), name='meeting_delete'),
    path('user_meetings/', UserMeetingListView.as_view(), name='user_meetings'),
    path('logout_redirect/', LogoutUserView.as_view(), name='logout_redirect'),
    path('<int:pk>/change_mail/', ChangeEmailView.as_view(), name='change_mail'),
    path('<int:pk>/change_username/', ChangeUsernameView.as_view(), name='change_username'),
    path('<int:pk>/user_profile/', UserProfileView.as_view(), name='user_profile'),
    path('get_city/', get_city, name='get_city'),
    path('get_cities/', get_meeting_city, name='get_cities'),
    path('get_subregions/', get_meeting_subregion, name='get_subregions'),
    path('meetings_map', meetings_map_view, name='meetings_map'),
    path('add_comment/<int:meeting_id>/', AddCommentView.as_view(), name='add_comment'),
    path('participation/', MeetingParticipationView.as_view(), name='participation'),
    path('<int:meeting_id>/payment/', CreatePaymentView.as_view(), name='payment'),
    path('success/', PaymentSuccessView.as_view(), name='success'),
    path('cancel/', PaymentCancelView.as_view(), name='cancel'),
    path('<int:pk>/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('messages/', UserMessagesView.as_view(), name='messages'),
    path('<int:pk>/rate/', RatingAddView.as_view(), name='rating'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user_messages/', UserMessagesListView.as_view(), name='user_messages')
]
