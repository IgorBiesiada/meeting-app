from rest_framework import serializers
from backend.participations.models import Participation

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['meeting']
        