from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.http import Http404
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import UpdateView, DetailView

from config.settings import DEFAULT_FROM_EMAIL
from user_profile.forms import UserUpdateEmailForm, UserUpdateUsernameForm
from users.models import User


# Create your views here.


class UserProfileView(DetailView):
    model = User
    template_name = 'user_profile.html'
    context_object_name = 'user'

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if obj != self.request.user:
            raise Http404
        return obj

class ChangeEmailView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserUpdateEmailForm
    template_name = 'change_email.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        email = form.cleaned_data['email']
        send_mail(
            'let s meet',
            'Zmiana maila przebiegła pomyślnie. Od teraz na ten mail bedą przychodziły powiadomienia',
            DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False
        )

        return super().form_valid(form)

class ChangeUsernameView(LoginRequiredMixin,UpdateView):
    model = User
    form_class = UserUpdateUsernameForm
    template_name = 'change_username.html'
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        email = self.request.user.email
        send_mail(
            'let s meet',
            'Zmiana nazwy użytkownika przebiegła pomyślnie',
            DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False
        )

        return super().form_valid(form)
