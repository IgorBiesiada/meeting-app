from django.shortcuts import render
from django.views.generic import View
from django.shortcuts import redirect

# Create your views here.

class HomeView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return render(request, 'home.html')
        return redirect('landing_page')
