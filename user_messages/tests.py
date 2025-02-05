from django.test import TestCase
import pytest
from django.urls import reverse
from user_messages.forms import MessageForm
from user_messages.models import Message
from users.models import User


# Create your tests here.

@pytest.mark.django_db
def test_message_model():
    sender = User.objects.create_user(
        username="testuser",
        first_name="testfirstname",
        last_name="testlastname",
        email="test@email.com",
        password="Testpassword1"
    )

    receiver = User.objects.create_user(
        username="othertestuser",
        first_name="othertestfirstname",
        last_name="othertestlastname",
        email="other@email.com",
        password="Testpassword1"
    )

    message = Message.objects.create(sender=sender, receiver=receiver, content="Testowa wiadomość")

    assert str(message) == f"From {sender} to {receiver} at {message.timestamp}"
    assert message.sender == sender
    assert message.receiver == receiver
    assert message.content == "Testowa wiadomość"


@pytest.mark.django_db
def test_message_form():
    sender = User.objects.create_user(
        username="testuser",
        first_name="testfirstname",
        last_name="testlastname",
        email="test@email.com",
        password="Testpassword1"
    )

    receiver = User.objects.create_user(
        username="othertestuser",
        first_name="othertestfirstname",
        last_name="othertestlastname",
        email="other@email.com",
        password="Testpassword1"
    )

    form_data = {"receiver": receiver.id, "content": "Testowa wiadomość"}
    form = MessageForm(data=form_data)

    assert form.is_valid()


@pytest.mark.django_db
def test_user_messages_create_view(client):
    sender = User.objects.create_user(
        username="testuser",
        first_name="testfirstname",
        last_name="testlastname",
        email="test@email.com",
        password="Testpassword1"
    )

    receiver = User.objects.create_user(
        username="othertestuser",
        first_name="othertestfirstname",
        last_name="othertestlastname",
        email="other@email.com",
        password="Testpassword1"
    )

    client.login(username="testuser", password="Testpassword1")

    url = reverse("messages")
    response = client.post(url, {"receiver": receiver.id, "content": "Testowa wiadomość"})

    assert response.status_code == 302
    assert Message.objects.count() == 1
    assert Message.objects.first().content == "Testowa wiadomość"
