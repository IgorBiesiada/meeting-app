from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views.generic import View
from django.shortcuts import redirect

# Create your views here.

class HomeView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = '/home/'

    def get(self, request):
        if request.user.is_authenticated:
            return render(request, 'home.html')
        return redirect('landing_page')
