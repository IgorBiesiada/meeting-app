from cities_light.models import City
from django.contrib.auth.views import LoginView
from django.http import JsonResponse

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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        region_id = self.request.GET.get('region_id')
        if region_id:
            context['form'].fields['region'].initial = region_id

        return context

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

def get_city(request):
    region_id = request.GET.get('region_id')
    if region_id:
        city = City.objects.filter(region_id=region_id).order_by('name').values('id', 'name')
        return JsonResponse(list(city), safe=False)
    return JsonResponse([], safe=False)
