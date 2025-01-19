from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views.generic import View
from django.shortcuts import redirect

# Create your views here.

class HomeView(LoginRequiredMixin, View):
    login_url = ''
    redirect_field_name = 'landing_page'

    def get(self, request):
        return render(request, 'home.html')
