from .models import User
from django.views.generic import CreateView
from users.forms import UserRegistrationForm


# Create your views here.

class RegisterUserView(CreateView):
    model = User
    form_class = UserRegistrationForm
    template_name = 'register.html'

    def form_valid(self, form):
        user = form.save()
        return user
