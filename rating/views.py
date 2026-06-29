from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from meetings.models import Meeting
from rating.serializers import RatingSerializer
from rating.models import Rating
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class RatingAddView(generics.CreateAPIView):
    model = Rating
    serializer_class = RatingSerializer
    authentication_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        meeting = get_object_or_404(Meeting, pk=self.kwargs.get('pk')) 
        serializer.save(meeting=meeting, author=self.request.user)
    
    def get_success_url(self):
        return reverse_lazy('meetings:meetings')
