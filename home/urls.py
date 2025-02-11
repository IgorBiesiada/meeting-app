from django.urls import path
from home.views import HomeView

app_name = 'home'

urlpatterns = [
    path('home/', HomeView.as_view(), name='home')
]
