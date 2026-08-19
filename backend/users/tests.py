import pytest 
from users.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

@pytest.mark.django_db
def test_create_account_valid():
    client = APIClient()
    url = reverse('users:users-list')

    data = {
        'first_name': 'Kamil',
        'last_name': 'user',
        'username': 'testuser',
        'email': 'validemail@gmail.com',
        'password': 'xxxValidPassword123',
        'city': 'Poznań',
        'region': 'Wielkopolska'
    }

    response = client.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.count() == 1
    assert User.objects.get().first_name == 'Kamil'

@pytest.mark.django_db
def test_create_account_invalid_first_name():
    client = APIClient()

    url = reverse('users:users-list')
    
    data = {
        'first_name': '111',
        'last_name': 'user',
        'username': 'testuser',
        'email': 'validemail@gmail.com',
        'password': 'xxxValidPassword123',
        'city': 'Poznań',
        'region': 'Wielkopolska'
    }
    
    response = client.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert User.objects.count() == 0

@pytest.mark.django_db
def test_create_account_invalid_last_name():
    client = APIClient()
    
    url = reverse('users:users-list')
        
    data = {
        'first_name': 'Test',
        'last_name': '111',
        'username': 'testuser',
        'email': 'validemail@gmail.com',
        'password': 'xxxValidPassword123',
        'city': 'Poznań',
        'region': 'Wielkopolska'
    }
        
    response = client.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert User.objects.count() == 0

@pytest.mark.django_db
def test_create_account_invalid_email():
    client = APIClient()
        
    url = reverse('users:users-list')
            
    data = {
        'first_name': 'Test',
        'last_name': 'test',
        'username': 'testuser',
        'email': 'validemail.com',
        'password': 'xxxValidPassword123',
        'city': 'Poznań',
        'region': 'Wielkopolska'
    }
            
    response = client.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert User.objects.count() == 0

@pytest.mark.django_db
def test_get_jwt_token_succes(client):
    User.objects.create_user(
        first_name="test",
        last_name="user",
        email="validemail@gmail.com",
        username="testuser", 
        password="SuperSecretPassword123!",
        city="Poznań",
        region="Wielkopolska"
        )

    data = {
        "username": "testuser",
        "password": "SuperSecretPassword123!"
    }

    response = client.post('/api/token/', data=data)
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert "access" in response_data
    assert "refresh" in response_data

@pytest.mark.django_db
def test_get_jwt_token_invalid_username(client):
    User.objects.create_user(
        first_name="test",
        last_name="user",
        email="validemail@gmail.com",
        username="testuser", 
        password="SuperSecretPassword123!",
        city="Poznań",
        region="Wielkopolska"
        )

    data = {
        "username": "user",
        "password": "SuperSecretPassword123!"
    }

    response = client.post('api/token/', data=data)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_get_jwt_token_invalid_password(client):
    User.objects.create_user(
        first_name="test",
        last_name="user",
        email="validemail@gmail.com",
        username="testuser", 
        password="SuperSecretPassword123!",
        city="Poznań",
        region="Wielkopolska"
        )

    data = {
        "username": "testuser",
        "password": "SuperSecretPassword"
    }

    response = client.post('api/token/', data=data)
    assert response.status_code == status.HTTP_404_NOT_FOUND