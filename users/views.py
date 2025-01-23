from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, PasswordChangeView
from .models import User
from django.views.generic import CreateView, TemplateView, UpdateView
from users.forms import UserRegistrationForm, CustomUserLoginForm, UserUpdateEmailForm
from django.core.mail import send_mail
from config.settings import DEFAULT_FROM_EMAIL
from django.urls import reverse_lazy
# Create your views here.

class RegisterUserView(CreateView):
    model = User
    form_class = UserRegistrationForm
    template_name = 'register.html'
    success_url = reverse_lazy('login')
    def form_valid(self, form):
        user = form.save()
        email = form.cleaned_data['email']
        send_mail(
            'lest s meet',
            'Witamy na pokładzie życzymy miłych spotkań',
            DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False
        )
        return super().form_valid(form)

class CustomLoginUserView(LoginView):
    form_class = CustomUserLoginForm
    template_name = 'login.html'
    redirect_authenticated_user = False
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        return super().form_valid(form)
class HomeBeforeLoginView(TemplateView):
    template_name = 'landing_page.html'

class LogoutUserView(TemplateView):
    template_name = 'landing_page.html'

class ChangeEmailView(UpdateView):
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