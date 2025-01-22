from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, DetailView, UpdateView

from meetings.forms import MeetingForm
from meetings.models import Meeting


# Create your views here.

class MeetingListView(ListView):
    model = Meeting
    template_name = 'meetings_list.html'
    context_object_name = 'meetings'
    paginate_by = 20

class MeetingAddView(LoginRequiredMixin, CreateView):
    model = Meeting
    form_class = MeetingForm
    template_name = 'add_meeting.html'
    success_url = reverse_lazy('meetings')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)

class MeetingDetailView(LoginRequiredMixin, DetailView):
    model = Meeting
    template_name = 'meeting_details.html'

class MeetingUpdateView(LoginRequiredMixin, UpdateView):
    model = Meeting
    fields = ['title', 'description', 'date', 'time', 'number_of_seats', 'price']
    template_name = 'meeting_edit.html'
    success_url = reverse_lazy('meetings')