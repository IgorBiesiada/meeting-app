from cities_light.models import Country
from django.core.exceptions import ValidationError
from django.test import Client

from users.forms import UserRegistrationForm, CustomUserLoginForm
from users.models import User, Region, City
from django.urls import reverse
import pytest

# Create your tests here.

@pytest.mark.django_db
def test_user_registration_form_invalid():
    country = Country.objects.create(name="Polska")
    region = Region.objects.create(name='Województwo', country=country)
    city = City.objects.create(name='Miasto', region=region, country=country)

    client = Client()

    data = {
        'username': 'testuser',
        'first_name': 'testfirstname',
        'last_name': 'testlastname',
        'email': 'test@email.com',
        'password1': 'Testpassword1',
        'password2': 'Testpassword1',
        'region': region.id,
        'city': city.id
    }

    response = client.post(reverse('register'), data)
    assert User.objects.count() == 1
    user = User.objects.first()
    assert user.username == 'testuser'
    assert response.status_code == 302
    assert response.url == reverse('login')

@pytest.mark.django_db
def test_user_registration_form_valid():
    data = {
        'username': 'testuser',
        'first_name': 'testfirstname',
        'last_name': 'testlastname',
        'email': 'invalid-email',
        'password1': 'Testpassword1',
        'password2': 'Testpassword1',
        'region': '',
        'city': ''
    }

    form = UserRegistrationForm(data=data)
    assert not form.is_valid()

    assert 'email' in form.errors
    assert 'region' in form.errors
    assert 'city' in form.errors

@pytest.mark.django_db
def test_user_login_form():
    user = User.objects.create_user(
        username='testuser',
        first_name='testfirstname',
        last_name='testlastname',
        email='test@email.com',
        password='Testpassword1'
    )

    valid_data = {
        'username': 'testuser',
        'password': 'Testpassword1'
    }

    form_valid = CustomUserLoginForm(data=valid_data)
    assert form_valid.is_valid()

    invalid_username_data = {
        'username': 'usertest',
        'password': 'Testpassword1'
    }

    form_invalid_username = CustomUserLoginForm(data=invalid_username_data)
    assert not form_invalid_username.is_valid()
    assert 'username' in form_invalid_username.errors or '__all__' in form_invalid_username.errors

    invalid_password_data = {
        'username': 'testuser',
        'password': 'passwordTest123'
    }

    form_invalid_password = CustomUserLoginForm(data=invalid_password_data)
    assert not form_invalid_password.is_valid()
    assert 'password' in form_invalid_password.errors or '__all__' in form_invalid_password.errors

@pytest.mark.django_db
def test_user_registration_duplicate():
    country = Country.objects.create(name="Polska")
    region = Region.objects.create(name='Województwo', country=country)
    city = City.objects.create(name='Miasto', region=region, country=country)

    User.objects.create_user(
        username='testuser',
        email='test@email.com',
        password='Testpassword1'
    )

    client = Client()

    data = {
        'username': 'testuser',
        'first_name': 'Test',
        'last_name': 'User',
        'email': 'test@email.com',  # Ten sam email
        'password1': 'Testpassword1',
        'password2': 'Testpassword1',
        'region': region.id,
        'city': city.id
    }

    response = client.post(reverse('register'), data)

    assert response.status_code == 200
    assert User.objects.count() == 1
