from rest_framework import serializers
from users.models import User

class UserSerializer(serializers.Serializer):
    model = User
    fields = ['city', 'region', 'email', 'is_baned']