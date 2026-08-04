from django.urls import path
from user_messages.views import UserListChatView, ChatListCreateView, MessageListCreateView, MessageRetrieveDestroyView

app_name = 'user_messages'

urlpatterns = [
    path('users_list', UserListChatView.as_view(), name='users_list'),
    path('api/chat/', ChatListCreateView.as_view(), name='chat_list'),
    path('api/chat/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message_list_create'),
    path('api/chat/<int:chat_id>/messages/<int:pk>/', MessageRetrieveDestroyView.as_view(), name='message_detail_destroy'),
]
