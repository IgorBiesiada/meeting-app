from rest_framework import serializers
from user_messages.models import Message, Chat
from users.models import User

class UserListChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ChatSerializer(serializers.ModelSerializer):
    participants = UserListChatSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at', 'last_message']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return representation

    def get_last_message(self, obj):
        last_message = obj.messages.first()

        if last_message:
            return {
                'content': last_message.content,
                'timestamp': last_message.timestamp
            }

        return None

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
        fields = ['id', 'chat', 'sender', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'chat', 'sender', 'timestamp', 'is_read']
        