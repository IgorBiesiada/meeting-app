from django.test import TestCase
import pytest
from django.urls import reverse
from user_profile.forms import UserUpdateEmailForm, UserUpdateUsernameForm, ChangePasswordForm
from users.models import User


# Create your tests here.

@pytest.mark.django_db
def test_user_profile_view(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    url = reverse('user_profile', kwargs={'pk': user.id})

    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse('landing_page'))

    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_user_profile_update_email_view(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    url = reverse('change_mail', kwargs={'pk': user.id})

    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse('landing_page'))

    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_user_profile_update_username_view(client):
    user = User.objects.create_user(username="testuser",
                                        first_name="testfirstname",
                                        last_name="testlastname",
                                        email="test@email.com",
                                        password="Testpassword1"
                                        )

    url = reverse('change_username', kwargs={'pk': user.id})

    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse('landing_page'))

    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_user_profile_update_password_view(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    url = reverse('change_password', kwargs={'pk': user.id})

    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse('landing_page'))

    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_user_update_email_form():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = UserUpdateEmailForm(data={"email": "newtest@email.com"}, instance=user)
    assert form.is_valid()
    form.save()
    user.refresh_from_db()
    assert user.email == "newtest@email.com"

@pytest.mark.django_db
def test_user_update_username_form():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = UserUpdateUsernameForm(data={"username": "newusername"}, instance=user)
    assert form.is_valid()
    form.save()
    user.refresh_from_db()
    assert user.username == "newusername"

@pytest.mark.django_db
def test_user_update_email_form_valid():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = UserUpdateEmailForm(data={"email": "valid-mail"}, instance=user)
    assert not form.is_valid()
    assert 'email' in form.errors


@pytest.mark.django_db
def test_user_update_username_form_valid():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = UserUpdateUsernameForm(data={"username": "testuser"}, instance=user)
    assert not form.is_valid()
    assert 'username' in form.errors

@pytest.mark.django_db
def test_user_update_password_form():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = ChangePasswordForm(user=user, data={
                                    "old_password": "Testpassword1",
                                    "new_password1": "newTestpassword1",
                                    "new_password2": "newTestpassword1"})

    assert form.is_valid()
    form.save()
    user.refresh_from_db()
    assert user.check_password("newTestpassword1")

@pytest.mark.django_db
def test_user_update_password_form_valid():
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    form = ChangePasswordForm(user=user, data={
        "old_password": "Testpassword1",
        "new_password1": "newTestpassword1",
        "new_password2": "newTest1"})

    assert not form.is_valid()
    assert 'new_password2' in form.errors

@pytest.mark.django_db
def test_user_update_username_permission(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    user2 = User.objects.create_user(username="testuser2",
                                    first_name="test2firstname",
                                    last_name="test2lastname",
                                    email="test2@email.com",
                                    password="Testpassword1"
                                    )

    url = reverse('change_username', kwargs={'pk': user.id})
    client.login(username="testuser2", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 404

@pytest.mark.django_db
def test_user_update_email_permission(client):
    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    user2 = User.objects.create_user(username="testuser2",
                                     first_name="test2firstname",
                                     last_name="test2lastname",
                                     email="test2@email.com",
                                     password="Testpassword1"
                                     )

    url = reverse('change_mail', kwargs={'pk': user.id})
    client.login(username="testuser2", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 404
