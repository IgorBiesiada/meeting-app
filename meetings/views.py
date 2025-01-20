from msilib.schema import ListView
from meetings.models import Meeting


# Create your views here.

class MeetingListView(ListView):
    model = Meeting
    template_name = 'meetings_list.html'
    context_object_name = 'meetings'
    paginate_by = 20

