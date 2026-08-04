from rest_framework import serializers
from meetings.models import Meeting
from participations.models import Participation

class MeetingSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'description', 'date', 'time', 'number_of_seats', 'price', 'meeting_city', 'meeting_region', 'street', 'creator_name', 'created_by']
    
        def get_is_participant(self, obj):
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return Participation.objects.filter(meeting=obj, participant=request.user).exists()
            return False

class MeetingCutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['title', 'description', 'date', 'time']
        