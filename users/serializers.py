from rest_framework import serializers
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'city', 'region']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ChangeEmailSerializer(serializers.Serializer):
    old_email = serializers.CharField(required=True)
    new_email = serializers.CharField(required=True)

class ChangeUsernameSerializer(serializers.Serializer):
    old_username = serializers.CharField(required=True)
    new_username = serializers.CharField(required=True)
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_banned:
           
            raise AuthenticationFailed(
                "Twoje konto zostało zbanowane.", 
                code='user_banned'
            )

        return data