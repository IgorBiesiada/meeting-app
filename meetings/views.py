from django.utils import timezone
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.mail import send_mail
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, DetailView, UpdateView, DeleteView
from django.core.exceptions import PermissionDenied
from comments.models import Comment
from meetings.forms import MeetingForm, MeetingEditForm
from meetings.models import Meeting
from django.http import JsonResponse
from cities_light.models import SubRegion, City
from participations.models import Participation
from config.settings import DEFAULT_FROM_EMAIL, GEOCODING_API_KEY
from opencage.geocoder import OpenCageGeocode
from rating.models import Rating
# Create your views here.

#wakacje123

class MeetingListView(LoginRequiredMixin, ListView):
    model = Meeting
    template_name = 'meetings_list.html'
    context_object_name = 'meetings'
    paginate_by = 20

    def get_queryset(self):
        queryset = Meeting.objects.all()
        query = self.request.GET.get('q', '').strip()   #stripe usuwa spacje na końcu i poczatku. jeśli parametr nie instnieje domyslnie pusty string
        min_price = self.request.GET.get('min_price', '')
        max_price = self.request.GET.get('max_price', '')
        min_number_of_seats = self.request.GET.get('min_number_of_seats', '')
        max_number_of_seats = self.request.GET.get('max_number_of_seats', '')

        if query:
            queryset = queryset.filter(title__icontains=query)  # icontains zawiera, bez rozróżniania wielkości liter).

        if min_price:
            min_price = float(min_price)
            queryset = queryset.filter(price__gte=min_price)    #get większe lub równe
        if max_price:
            max_price = float(max_price)
            queryset = queryset.filter(price__lte=max_price)    #lte mniejsze lub równe

        if min_number_of_seats:
            min_number_of_seats = int(min_number_of_seats)
            queryset = queryset.filter(number_of_seats__gte=min_number_of_seats)
        if max_number_of_seats:
            max_number_of_seats = int(max_number_of_seats)
            queryset = queryset.filter(number_of_seats__lte=max_number_of_seats)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        meetings = context['meetings']
        user = self.request.user    #pobieranie aktualnego zalogowanego uzytkonika

        user_ratings = {
            meeting.id: Rating.objects.filter(meeting=meeting, user=self.request.user).exists()
            for meeting in meetings
        }

        context['user_ratings'] = user_ratings  #dodajemy do kontekstu
        return context

class MeetingAddView(LoginRequiredMixin, CreateView):
    model = Meeting
    form_class = MeetingForm
    template_name = 'add_meeting.html'
    success_url = reverse_lazy('meetings')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        response = super().form_valid(form)
        self.send_mail(self.request.user.email)
        return response

    def send_mail(self, user_mail):
        send_mail(
            'let s meet',
            'Właśnie utworzyłeś spotkanie!!!! Gratulacje!!!!',
            DEFAULT_FROM_EMAIL,
            [user_mail],
            fail_silently=False
        )


class MeetingDetailView(LoginRequiredMixin, DetailView):
    model = Meeting
    template_name = 'meeting_details.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        context['comments'] = Comment.objects.filter(meeting=self.object)

        context['is_participant'] = Participation.objects.filter(meeting=self.object, participant=user).exists()

        return context

class MeetingUpdateView(LoginRequiredMixin, UpdateView):
    model = Meeting
    template_name = 'meeting_edit.html'
    success_url = reverse_lazy('meetings')
    form_class = MeetingEditForm

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if obj.created_by != self.request.user:
            raise PermissionDenied
        return obj



class DeleteMeetingView(LoginRequiredMixin, DeleteView):
    model = Meeting
    template_name = 'meeting_confirm_delete.html'
    success_url = reverse_lazy('meetings')

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if obj.created_by != self.request.user:
            raise PermissionDenied
        return obj

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


def meetings_map_view(request):
    geocoder = OpenCageGeocode(GEOCODING_API_KEY)

    meetings = Meeting.objects.all()
    locations = []

    for meeting in meetings:
        if meeting.meeting_city and meeting.meeting_city.latitude and meeting.meeting_city.longitude:
            locations.append({
                'title': meeting.title,
                'lat': float(meeting.meeting_city.latitude),  # Pobranie szerokości geograficznej
                'lon': float(meeting.meeting_city.longitude),  # Pobranie długości geograficznej
                'description': meeting.description,
            })

    context = {
            'locations': locations,
            }

    return render(request, 'map.html', context)

class OutdatedMeetingsListView(LoginRequiredMixin, ListView):
    model = Meeting
    context_object_name = 'meetings'
    template_name = 'meetings_outdated_list.html'

    def get_queryset(self):
        now = timezone.now()
        outdated_meeting = Meeting.objects.filter(date__lt=now)
        return outdated_meeting
