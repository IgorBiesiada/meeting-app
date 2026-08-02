from django.urls import path
from user_messages.views import UserMessagesView, UserMessagesListView

app_name = 'user_messages'

urlpatterns = [
    path('messages/', UserMessagesView.as_view(), name='messages'),
    path('user_messages/', UserMessagesListView.as_view(), name='user_messages')
]
