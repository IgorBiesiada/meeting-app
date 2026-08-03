from rest_framework import serializers
from user_messages.models import Message, Chat
from users.models import User

class UserListChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ChatSerializer(serializers.ModelSerializer):
    participants = UserListChatSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at']

        def to_representation(self, instance):
            representation = super().to_representation(instance)
            return representation

class MessageSerializer(serializers.ModelSerializer):
    sender = UserListChatSerializer()
    participants = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'timestamp', 'participants']

        def get_participants(self, obj):
            return UserListChatSerializer(obj.chat.participants.all(), many=True).data


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['chat', 'content']

        def create(self, validate_data):
            message = Message.objects.create(**validate_data)
            return message