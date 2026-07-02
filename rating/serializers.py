from rest_framework import serializers
from rating.models import Rating

class RatingSerializer(serializers.ModelSerializer):
    model = Rating
    fields = ['user','meeting', 'rating']