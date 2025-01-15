from .models import User
from django.views.generic import CreateView
from users.forms import UserRegistrationForm
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
