from cities_light.models import Country, City, Region, SubRegion
from django.test import TestCase
import pytest
from django.test import Client
from django.urls import reverse
from unittest import mock
from meetings.forms import MeetingForm
from meetings.models import Meeting
from users.models import User
from django.core import mail

# Create your tests here.
@pytest.mark.django_db
def test_meeting_form_invalid():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    data = {
        'title': 'testtitle',
        'description': 'testdescription',
        'date': '2025-02-10',
        'time': '14:00:00',
        'number_of_seats': 10,
        'waiting_people': 0,
        'price': 0.00,
        'meeting_city_id': meeting_city.id,
        'meeting_region_id': meeting_region.id,
        'meeting_subregion_id': meeting_subregion.id
    }

    response = client.post(reverse('add_meeting'), data)
    assert Meeting.objects.count() == 1
    meeting = Meeting.objects.first()
    assert meeting.title == 'testtitle'
    assert response.status_code == 302
    assert response.url == reverse('meetings')

@pytest.mark.django_db
def test_meeting_form_valid_title():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    data = {
        'title': 123,
        'description': 'testdescription',
        'date': '2025-02-10',
        'time': '14:00:00',
        'number_of_seats': 10,
        'waiting_people': 0,
        'price': 0.00,
        'meeting_city_id': meeting_city.id,
        'meeting_region_id': meeting_region.id,
        'meeting_subregion_id': meeting_subregion.id
    }

    form = MeetingForm(data=data)
    assert not form.is_valid()

    assert 'title' in form.errors

@pytest.mark.django_db
def test_meeting_form_valid_description():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    data = {
        'title': 'testtitle',
        'description': '',
        'date': '2025-02-10',
        'time': '14:00:00',
        'number_of_seats': 10,
        'waiting_people': 0,
        'price': 0.00,
        'meeting_city_id': meeting_city.id,
        'meeting_region_id': meeting_region.id,
        'meeting_subregion_id': meeting_subregion.id
    }

    form = MeetingForm(data=data)
    assert not form.is_valid()

    assert 'description' in form.errors

@pytest.mark.django_db
def test_meeting_form_valid_date():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    data = {
        'title': 'testtitle',
        'description': 'testdescription',
        'date': '',
        'time': '14:00:00',
        'number_of_seats': 10,
        'waiting_people': 0,
        'price': 0.00,
        'meeting_city_id': meeting_city.id,
        'meeting_region_id': meeting_region.id,
        'meeting_subregion_id': meeting_subregion.id
    }

    form = MeetingForm(data=data)
    assert not form.is_valid()

    assert 'date' in form.errors

@pytest.mark.django_db
def test_meeting_form_valid_number_of_seats():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    data = {
        'title': 'testtitle',
        'description': 'testdescription',
        'date': '2025-02-10',
        'time': '14:00:00',
        'number_of_seats': 0,
        'waiting_people': 0,
        'price': 0.00,
        'meeting_city_id': meeting_city.id,
        'meeting_region_id': meeting_region.id,
        'meeting_subregion_id': meeting_subregion.id
    }

    form = MeetingForm(data=data)
    assert not form.is_valid()

    assert 'number_of_seats' in form.errors

@pytest.mark.django_db
def test_meetings_list_view(client):
    user = User.objects.create_user(username='testuser', first_name='testfirstname',
        last_name='testlastname',
        email='test@email.com',
        password='Testpassword1'
        )

    logged_in = client.login(username='testuser', password='Testpassword1')
    assert logged_in

    url = reverse('meetings')
    response = client.get(url)

    print("\n\n---- HTML RESPONSE ----\n", response.content.decode())
    print("\n\n---- HTML RESPONSE ----\n", response.templates)

    assert response.status_code == 200
    assert response.content.decode()

    @pytest.mark.django_db
    def test_meetings_create_view(client):
        # Tworzenie wymaganych obiektów
        country = Country.objects.create(name="Polska")
        meeting_region = Region.objects.create(name='Województwo', country=country)
        meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
        meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

        url = reverse('add_meeting')

        # Sprawdzenie, czy niezalogowany użytkownik dostaje przekierowanie (302)
        response = client.get(url)
        assert response.status_code == 302

        # Tworzenie użytkownika i logowanie
        user = User.objects.create_user(
            username='testuser',
            first_name='testfirstname',
            last_name='testlastname',
            email='test@email.com',
            password='Testpassword1'
        )
        assert client.login(username='testuser', password='Testpassword1')

        # Sprawdzenie, czy zalogowany użytkownik ma dostęp do formularza
        response = client.get(url)
        assert response.status_code == 200

        # Mockowanie wysyłki e-maila
        with mock.patch('meetings.views.send_mail') as mock_send_mail:
            response = client.post(url, {
                'title': 'testtitle',
                'description': 'testdesciption',
                'date': '2025-02-05',
                'time': '14:00:00',
                'number_of_seats': 10,
                'price': 0,
                'meeting_city': meeting_city.id,
                'meeting_region': meeting_region.id,
                'meeting_subregion': meeting_subregion.id
            }, follow=True)  # `follow=True` sprawia, że Django śledzi przekierowania

        if response.status_code == 200:
            print("Błędy formularza:", response.context['form'].errors)  # Debug błędów

        assert response.status_code == 302  # Oczekujemy przekierowania
        assert Meeting.objects.count() == 1  # Sprawdzenie, czy spotkanie zostało dodane
        mock_send_mail.assert_called_once()

@pytest.mark.django_db
def test_meetings_detail_view(client):
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

    user = User.objects.create_user(username='testuser',
                                first_name='testfirstname',
                                last_name='testlastname',
                                email='test@email.com',
                                password='Testpassword1'
                                    )

    client.login(username='testuser', password='Testpassword1')

    meeting = Meeting.objects.create(title='testtitle',
                                     description='testdescription',
                                     date='2025-02-05',
                                     time='14:00:00',
                                     number_of_seats=10,
                                     price=0,
                                     created_by=user,
                                     meeting_city=meeting_city,
                                     meeting_subregion=meeting_subregion,
                                     meeting_region=meeting_region
                                     )

    url = reverse('meeting_detail', kwargs={'pk': meeting.id})
    response = client.get(url)

    assert response.status_code == 200
    assert 'testtitle' in response.content.decode()

@pytest.mark.django_db
def test_meetings_update_view(client):
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

    user = User.objects.create_user(username='testuser',
                                first_name='testfirstname',
                                last_name='testlastname',
                                email='test@email.com',
                                password='Testpassword1'
                                    )

    other_user = User.objects.create_user(username='other_user',
                                first_name='testfirstname',
                                last_name='testlastname',
                                email='other_test@email.com',
                                password='Testpassword1'
                                    )

    meeting = Meeting.objects.create(
        title='testtitle',
        description='testdescription',
        date='2025-02-05',
        time='14:00:00',
        number_of_seats=10,
        price=0,
        created_by=user,
        meeting_city=meeting_city,
        meeting_subregion=meeting_subregion,
        meeting_region=meeting_region
    )

    url = reverse('meeting_edit', kwargs={'pk': meeting.id})


    response = client.get(url)
    assert response.status_code == 302


    client.login(username="other_user", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 403


    client.login(username="testuser", password="Testpassword1")
    response = client.get(url)
    assert response.status_code == 200

    response = client.post(url, {
        'title': 'new testtitle',
        'description': 'new description',
        'date': '2025-02-06',
        'time': '15:00:00',
        'number_of_seats': 15,
        'price': 20
    })

    assert response.status_code == 302

    meeting.refresh_from_db()
    assert meeting.title == 'new testtitle'
    assert meeting.description == 'new description'
    assert meeting.date.strftime('%Y-%m-%d') == '2025-02-06'
    assert meeting.time.strftime('%H:%M:%S') == '15:00:00'
    assert meeting.number_of_seats == 15
    assert meeting.price == 20

@pytest.mark.django_db
def test_meetings_delete_view(client):
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

    user = User.objects.create_user(username='testuser',
                                first_name='testfirstname',
                                last_name='testlastname',
                                email='test@email.com',
                                password='Testpassword1')

    meeting = Meeting.objects.create(title='testtitle',
                            description='testdescription',
                            date='2025-02-05',
                            time='14:00:00',
                            number_of_seats=10,
                            price=0,
                            created_by=user,
                            meeting_city=meeting_city,
                            meeting_subregion=meeting_subregion,
                            meeting_region=meeting_region
                                     )

    url = reverse('meeting_delete', kwargs={'pk': meeting.id})

    response = client.get(url)
    assert response.status_code == 302

    client.login(username="testuser", password="Testpassword1")

    response = client.get(url)
    assert response.status_code == 200

    response = client.post(url, follow=True)
    assert response.status_code == 200
    assert Meeting.objects.count() == 0

@pytest.mark.django_db
def test_user_meetings_list_view(client):
    user = User.objects.create_user(username='testuser', first_name='testfirstname',
                                    last_name='testlastname',
                                    email='test@email.com',
                                    password='Testpassword1'
                                    )

    logged_in = client.login(username='testuser', password='Testpassword1')
    assert logged_in

    url = reverse('user_meetings')
    response = client.get(url)

    print("\n\n---- HTML RESPONSE ----\n", response.content.decode())
    print("\n\n---- HTML RESPONSE ----\n", response.templates)

    assert response.status_code == 200
    assert 'Twoje spotkania' in response.content.decode()
