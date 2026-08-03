from django.urls import path
from user_messages.views import UserMessagesView, ChatListView, ChatMessagesView

app_name = 'user_messages'

urlpatterns = [
    path('messages/', UserMessagesView.as_view(), name='messages'),
    path('chats/', ChatListView.as_view(), name='chats'),
    path('chats/<int:pk>/messages', ChatMessagesView.as_view(), name='chat_messages')
]
