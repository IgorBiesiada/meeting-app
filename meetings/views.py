from msilib.schema import ListView

from django.views.generic import CreateView

from meetings.forms import MeetingForm
from meetings.models import Meeting


# Create your views here.

class MeetingListView(ListView):
    model = Meeting
    template_name = 'meetings_list.html'
    context_object_name = 'meetings'
    paginate_by = 20

class MeetingAddView(CreateView):
    model = Meeting
    form_class = MeetingForm
    template_name = 'add_meeting.html'
    success_url = 'meetings_list'