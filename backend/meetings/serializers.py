from rest_framework import serializers
from backend.meetings.models import Meeting
from backend.participations.models import Participation

class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['title', 'description', 'date', 'time', 'number_of_seats', 'price', 'meeting_city', 'meeting_region', 'meeting_subregion']
    
        def get_is_participant(self, obj):
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return Participation.objects.filter(meeting=obj, participant=request.user).exists()
            return False
