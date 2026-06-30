from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import PasswordChangeView
from django.core.mail import send_mail
from django.http import Http404
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import UpdateView, DetailView
from config.settings import DEFAULT_FROM_EMAIL
from users.models import User


# Create your views here.


class ChangePasswordView(LoginRequiredMixin, PasswordChangeView):
    model = User
    form_class = PasswordChangeForm
    template_name = 'change_password.html'
    success_url = reverse_lazy('home:home')
