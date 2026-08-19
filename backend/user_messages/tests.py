import pytest
from rest_framework import status
from django.urls import reverse
from user_messages.models import Chat, Message
from users.models import User


@pytest.mark.django_db
def test_create_chat(auth_client1, user1, user2):
    

    data = {
        "participant": [user1.id, user2.id]
    }

    url = reverse('user_messages:chat_list')

    response = auth_client1.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Chat.objects.count() == 1
    response_data = response.json()
    assert len(response_data['participants']) == 2


@pytest.mark.django_db
def test_create_message(auth_client1, user1, user2):
    chat = Chat.objects.create()
    chat.participants.add(user1, user2)

    data = {
        "content": "Siemano, to jest test z Pytesta!"
    }

    url = reverse('user_messages:message_list_create', kwargs={'chat_id': chat.id})
    response = auth_client1.post(url, data=data)

    assert response.status_code == status.HTTP_201_CREATED
    assert Message.objects.count() == 1
    saved_message = Message.objects.first()
    assert saved_message.content == "Siemano, to jest test z Pytesta!"
    assert saved_message.sender == user1
    assert saved_message.chat == chat