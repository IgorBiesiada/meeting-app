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

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['old_password', 'new_password']
    
    def update(self, instance, validated_data):
        old_password = validated_data["old_password"]
        new_password = validated_data["new_password"]

        if not instance.check_password(old_password):
            raise serializers.ValidationError("Złe stare hasło")

        instance.set_password(new_password)
        instance.save()

        return instance 

class ChangeEmailSerializer(serializers.ModelSerializer):
    old_email = serializers.EmailField(required=True)
    new_email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['old_email', 'new_email']
    
    def update(self, instance, validated_data):
        old_email = validated_data['old_email']
        new_email = validated_data['new_email']
        
        if instance.email != old_email:
            raise serializers.ValidationError("Zły email")
        
        instance.email = new_email
        instance.save()

        return instance


class ChangeUsernameSerializer(serializers.ModelSerializer):
    old_username = serializers.CharField(required=True)
    new_username = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ['old_username', 'new_username']

    def update(self, instance, validated_data):
        old_username = validated_data['old_username']
        new_username = validated_data['new_username']

        if instance.username != old_username:
            raise serializers.ValidationError("Zła nazawa użytkownika")
        
        instance.username = new_username
        instance.save()
        return instance

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.is_baned:
           
            raise AuthenticationFailed(
                "Twoje konto zostało zbanowane.", 
                code='user_banned'
            )

        return data