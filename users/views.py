from .models import User
from django.views.generic import CreateView
from users.forms import UserRegistrationForm
from django.core.mail import send_mail

# Create your views here.

class RegisterUserView(CreateView):
    model = User
    form_class = UserRegistrationForm
    template_name = 'register.html'

    def form_valid(self, form):
        user = form.save()
        send_mail(
            'lest s meet',
            'Witamy na pokładzie życzymy miłych spotkań',
            'example@email.com',
            [User.email],
            fail_silently=False
        )
        return super().form_valid(form)
