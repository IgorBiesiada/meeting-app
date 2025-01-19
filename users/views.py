from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect, render
from django.views import View

from .models import User
from django.views.generic import CreateView, TemplateView
from users.forms import UserRegistrationForm, CustomUserLoginForm
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

class CustomLoginUserView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect('home')
        form = UserRegistrationForm()
        return render(request, 'landing_page.html', {'form': form})

    def post(self, request):
        form = CustomUserLoginForm
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        return render(request, 'landing_page.html', {'form': form})
class HomeBeforeLoginView(LoginRequiredMixin, TemplateView):
    template_name = 'landing_page.html'