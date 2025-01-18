from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from .models import User
from django.views.generic import CreateView, TemplateView
from users.forms import UserRegistrationForm, UserLoginForm
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

class LoginUserView(LoginView):
    form_class = UserLoginForm
    template_name = 'login.html'
    success_url = reverse_lazy('home')

class HomeBeforeLoginView(LoginRequiredMixin, TemplateView):
    template_name = 'landing_page.html'