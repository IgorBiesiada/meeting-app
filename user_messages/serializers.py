from rest_framework import serializers
from user_messages.models import Message


class MessageSerializer(serializers.Serializer):
    model = Message
    fields = ['sender', 'receiver', 'content', 'timestamp']