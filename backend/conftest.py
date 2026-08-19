import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def user1():
    return User.objects.create_user(
            first_name="test",
            last_name="user",
            email="validemail@gmail.com",
            username="testuser1", 
            password="SuperSecretPassword123!",
            city="Poznań",
            region="Wielkopolska"
            )

@pytest.fixture
def user2():
    return User.objects.create_user(
            first_name="test",
            last_name="user",
            email="emailvalid@gmail.com",
            username="testuser2", 
            password="SuperSecretPassword123!",
            city="Poznań",
            region="Wielkopolska"
            )

@pytest.fixture
def auth_client1(user1):
    client = APIClient()
    client.force_authenticate(user=user1)
    return client

@pytest.fixture
def auth_client2(user2):
    client = APIClient()
    client.force_authenticate(user=user2)
    return client