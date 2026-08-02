from rest_framework import generics
from user_messages.models import Message
from user_messages.serializers import MessageSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
# Create your views here.

class UserMessagesView(generics.CreateAPIView):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
    

class UserMessagesListView(generics.ListAPIView):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(Q(receiver=user) | Q(sender=user))
