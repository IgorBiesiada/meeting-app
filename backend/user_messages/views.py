from rest_framework import generics
from user_messages.models import Message, Chat
from user_messages.serializers import MessageSerializer, ChatSerializer, UserListChatSerializer, CreateMessageSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.exceptions import PermissionDenied

from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from users.models import User
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class UserListChatView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListChatSerializer
    permission_classes = [IsAuthenticated]


class ChatListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(participants=self.request.user).prefetch_related('participants')

    def create(self, request, *args, **kwargs):
        participants_data = request.data.get('participant', [])

        if len(participants_data) != 2:
            return Response(
                {'error': 'Chat needs two participants'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(request.user.id) not in map(str, participants_data):
            return Response(
                {'error': 'You are not participant of this chat'},
                status=status.HTTP_403_FORBIDDEN
            )

        users = User.objects.filter(id__in=participants_data)
        if users.count() != 2:
            return Response(
                {'error': 'Chat needs exactly two participants'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_chat = Chat.objects.filter(participants__id=participants_data[0]).filter(participants__id=participants_data[1]).distinct()

        if existing_chat.exists():
            chat = existing_chat.first()
            serializer = self.get_serializer(chat)
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.participants.set(users)

        serializer = self.get_serializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        chat = self.get_chat(chat_id)
        return chat.messages.order_by('timestamp')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateMessageSerializer
        return MessageSerializer

    def perform_create(self, serializer):
        chat_id = self.kwargs['chat_id']
        chat = self.get_chat(chat_id)
        serializer.save(sender=self.request.user, chat=chat)
    
    def get_chat(self, chat_id):
        chat = get_object_or_404(Chat, id=chat_id)
        if self.request.user not in chat.participants.all():
            raise PermissionDenied('You are not a participant of this chat')
        return chat


class MessageRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        
        return Message.objects.filter(
            chat__id=chat_id,
            chat__participants=self.request.user
        )
        
    def perform_destroy(self, instance):
        if instance.sender != self.request.user:
            raise PermissionDenied('You are not the sender of this message')
        instance.delete()
        