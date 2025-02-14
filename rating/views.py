from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from meetings.models import Meeting
from rating.forms import RatingForm
from rating.models import Rating


# Create your views here.

class RatingAddView(LoginRequiredMixin, CreateView):
    model = Rating
    form_class = RatingForm
    template_name = 'rating.html'

    def form_valid(self, form):
        meeting = get_object_or_404(Meeting, pk=self.kwargs.get('pk'))  #pobieranie spotkania
        form.instance.meeting = meeting     #przypisanie spotkania do oceny
        form.instance.user = self.request.user      # przypisanie użytkownika
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('meetings:meetings')
