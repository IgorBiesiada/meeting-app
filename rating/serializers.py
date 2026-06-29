from rest_framework import serializers
from rating.models import Rating

class RatingSerializer(serializers.Serializer):
    model = Rating
    fields = ['user','meeting', 'rating']