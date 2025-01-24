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
from django.urls import path
from home.views import HomeView
from meetings.views import MeetingListView, MeetingAddView, MeetingDetailView, MeetingUpdateView, DeleteMeetingView, UserMeetingListView
from users.views import (RegisterUserView, CustomLoginUserView, HomeBeforeLoginView, LogoutUserView, ChangeEmailView,
    ChangeUsernameView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', CustomLoginUserView.as_view(), name='login'),
    path('', HomeBeforeLoginView.as_view(), name='landing_page'),
    path('home/', login_required(HomeView.as_view()), name='home'),
    path('meetings/', login_required(MeetingListView.as_view()), name='meetings'),
    path('add_meeting/', login_required(MeetingAddView.as_view()), name='add_meeting'),
    path('<int:pk>/', login_required(MeetingDetailView.as_view()), name='meeting_detail'),
    path('<int:pk>', login_required(MeetingUpdateView.as_view()), name='meeting_edit'),
    path('<int:pk>/delete/', login_required(DeleteMeetingView.as_view()), name='meeting_delete'),
    path('user_meetings/', login_required(UserMeetingListView.as_view()), name='user_meetings'),
    path('logout_redirect/', LogoutUserView.as_view(), name='logout_redirect'),
    path('<int:pk>/change_mail/', ChangeEmailView.as_view(), name='change_mail'),
    path('<int:pk>/change_username/', ChangeUsernameView.as_view(), name='change_username')
]
