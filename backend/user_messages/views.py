from rest_framework import generics
from user_messages.models import Message, Chat
from user_messages.serializers import MessageSerializer, ChatSerializer, UserListChatSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
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

class ChatListView(generics.ListCreateAPIView):
    
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(participants=self.request.user).prefetch_related('participants')

    def create(self, request, *args, **kwargs):
        participants_data = request.data.get('participant', [])

        if len(participants_data) != 2:
            return Response({
                'error': 'Chat needs two participants'},
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
            return Response({'error': 'Chat already exist'},
                            status=status.HTTP_400_BAD_REQUEST
                            )


class UserMessagesView(generics.CreateAPIView):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
 


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        chat = get_object_or_404(Chat, id=chat_id, partycipants=request.user)
        messages = chat.messages.content
