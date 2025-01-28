from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, DetailView, UpdateView, DeleteView
from meetings.forms import MeetingForm
from meetings.models import Meeting
from django.http import JsonResponse
from cities_light.models import SubRegion, City

# Create your views here.

class MeetingListView(ListView):
    model = Meeting
    template_name = 'meetings_list.html'
    context_object_name = 'meetings'
    paginate_by = 20

    def get_queryset(self):
        queryset = Meeting.objects.all()
        query = self.request.GET.get('q', '').strip()
        min_price = self.request.GET.get('min_price', '')
        max_price = self.request.GET.get('max_price', '')
        min_number_of_seats = self.request.GET.get('min_number_of_seats', '')
        max_number_of_seats = self.request.GET.get('max_number_of_seats', '')

        if query:
            queryset = queryset.filter(title__icontains=query)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if min_number_of_seats:
            queryset = queryset.filter(number_of_seats__gte=min_number_of_seats)
        if max_number_of_seats:
            queryset = queryset.filter(number_of_seats__lte=max_number_of_seats)

        return queryset
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

class DeleteMeetingView(LoginRequiredMixin, DeleteView):
    model = Meeting
    template_name = 'meeting_confirm_delete.html'
    success_url = reverse_lazy('meetings')

class UserMeetingListView(LoginRequiredMixin, ListView):
    model = Meeting
    template_name = 'user_meetings.html'
    context_object_name = 'meetings'
    paginate_by = 20

    def get_queryset(self):
        qs = Meeting.objects.filter(created_by=self.request.user)
        return qs

def get_meeting_subregion(request):
    region_id = request.GET.get('region_id')
    if region_id:
        subregion = SubRegion.objects.filter(region_id=region_id).order_by('name').values('id', 'name')
        return JsonResponse(list(subregion), safe=False)
    return JsonResponse([], safe=False)

def get_meeting_city(request):
    region_id = request.GET.get('region_id')
    if region_id:
        cities = City.objects.filter(region_id=region_id).order_by('name').values('id', 'name')
        return JsonResponse(list(cities), safe=False)
    return JsonResponse([], safe=False)
