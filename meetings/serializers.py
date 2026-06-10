from rest_framework import serializers
from meetings.models import Meeting

class MeetingSerializer(serializers.serializer):
    model = Meeting
    fields = ['title', 'description', 'date', 'time', 'created_by', 'created_at',
              'number_of_seats', 'price', 'meeting_city', 'meeting_region', 'meeting_subregion']
    