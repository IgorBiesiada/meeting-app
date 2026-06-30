from rest_framework import serializers
from users.models import User

class UserSerializer(serializers.Serializer):
    model = User
    fields = ['city', 'region', 'email', 'is_baned']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ChangeEmailSerializer(serializers.Serializer):
    old_email = serializers.CharField(required=True)
    new_email = serializers.CharField(required=True)

class ChangeUsernameSerializer(serializers.Serializer):
    old_username = serializers.CharField(required=True)
    new_username = serializers.CharField(required=True)
    