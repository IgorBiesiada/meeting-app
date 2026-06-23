from rest_framework import serializers
from participations.models import Participation

class ParticipationSerializer(serializers.Serializer):
    model = Participation
    fields = ['participant', 'meeting', 'is_waiting']