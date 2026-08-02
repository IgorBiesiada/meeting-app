from rest_framework import serializers
from participations.models import Participation

class ParticipationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participation
        fields = ['meeting']
        