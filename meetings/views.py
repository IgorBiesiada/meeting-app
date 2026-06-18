from django.utils import timezone
from django.core.mail import send_mail
from django.shortcuts import render
from meetings.models import Meeting
from django.http import JsonResponse
from cities_light.models import SubRegion, City
from participations.models import Participation
from config.settings import DEFAULT_FROM_EMAIL, GEOCODING_API_KEY
from opencage.geocoder import OpenCageGeocode
from rating.models import Rating
from rest_framework import generics
from meetings.serializers import MeetingSerializer
from rest_framework.permissions import IsAuthenticated
from meetings.permissions import IsOwner
from rest_framework.decorators import api_view
# Create your views here.


class MeetingListView(generics.ListAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        date = timezone.now()
        queryset = Meeting.objects.filter(date__gte=date)
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


class MeetingAddView(generics.CreateAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        self.send_mail(self.request.user.email)
        
    def send_mail(self, user_mail):
        send_mail(
            'let s meet',
            'Właśnie utworzyłeś spotkanie!!!! Gratulacje!!!!',
            DEFAULT_FROM_EMAIL,
            [user_mail],
            fail_silently=False
        )


class MeetingDetailView(generics.RetrieveAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated]

    

class MeetingUpdateView(generics.RetrieveUpdateAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, IsOwner]



class DeleteMeetingView(generics.RetrieveDestroyAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, IsOwner]

class UserMeetingListView(generics.ListAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        queryset = Meeting.objects.filter(created_by=self.request.user)
        return queryset

@api_view(['GET'])
def get_meeting_subregion(request):
    region_id = request.query_params.get('region_id')
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

class OutdatedMeetingsListView(generics.ListAPIView):
    model = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classe = [IsAuthenticated]

    def get_queryset(self):
        now = timezone.now()
        outdated_meeting = Meeting.objects.filter(date__lt=now)
        return outdated_meeting

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        meetings = context['meetings']
        user = self.request.user  # pobieranie aktualnego zalogowanego uzytkonika

        user_ratings = {
            meeting.id: Rating.objects.filter(meeting=meeting, user=self.request.user).exists()
            for meeting in meetings
        }

        context['user_ratings'] = user_ratings  # dodajemy do kontekstu
        return context
