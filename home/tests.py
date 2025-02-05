from django.test import TestCase
import pytest
from django.urls import reverse
from users.models import User


# Create your tests here.

@pytest.mark.django_db
def test_home_page(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1")

    url = reverse('home')
    response = client.get(url)

    assert response.status_code == 302
    assert response.url.startswith(reverse('landing_page'))

    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)

    assert response.status_code == 200
    assert 'home.html'
