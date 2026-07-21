from django.utils import timezone
from django.core.mail import send_mail
from django.shortcuts import render
from meetings.models import Meeting
from django.http import JsonResponse
from config.settings import DEFAULT_FROM_EMAIL
from opencage.geocoder import OpenCageGeocode
from rating.models import Rating
from rest_framework import generics
from meetings.serializers import MeetingSerializer, MeetingCutSerializer
from rest_framework import permissions  
from meetings.permissions import IsOwnerOrReadOnly
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# Create your views here.


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        date = timezone.now()
        queryset = Meeting.objects.filter(date__gte=date)
        query = self.request.GET.get('q', '').strip()   
        min_price = self.request.GET.get('min_price', '')
        max_price = self.request.GET.get('max_price', '')
        min_number_of_seats = self.request.GET.get('min_number_of_seats', '')
        max_number_of_seats = self.request.GET.get('max_number_of_seats', '')

        if query:
            queryset = queryset.filter(title__icontains=query)  

        if min_price:
            min_price = float(min_price)
            queryset = queryset.filter(price__gte=min_price)    
        if max_price:
            max_price = float(max_price)
            queryset = queryset.filter(price__lte=max_price)    

        if min_number_of_seats:
            min_number_of_seats = int(min_number_of_seats)
            queryset = queryset.filter(number_of_seats__gte=min_number_of_seats)
        if max_number_of_seats:
            max_number_of_seats = int(max_number_of_seats)
            queryset = queryset.filter(number_of_seats__lte=max_number_of_seats)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
#        self.send_mail(self.request.user.email)

#    def send_mail(self, user_mail):
#        send_mail(
#            'let s meet',
#            'Właśnie utworzyłeś spotkanie!!!! Gratulacje!!!!',
#            DEFAULT_FROM_EMAIL,
#            [user_mail],
#            fail_silently=False
#        )

    @action(detail=False, methods=['get'])
    def my_meetings(self, request):
        queryset = Meeting.objects.filter(created_by=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
        user = self.request.user  

        user_ratings = {
            meeting.id: Rating.objects.filter(meeting=meeting, user=self.request.user).exists()
            for meeting in meetings
        }

        context['user_ratings'] = user_ratings  
        return context

class CutMeetingView(generics.ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingCutSerializer

    
