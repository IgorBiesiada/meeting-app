from rest_framework import serializers
from user_messages.models import Message


class MessageSerializer(serializers.ModelSerializer):
    model = Message
    fields = ['sender', 'receiver', 'content', 'timestamp']