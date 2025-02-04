from cities_light.models import Country, City, Region, SubRegion
from django.test import TestCase
import pytest
from django.test import Client
from django.urls import reverse

from meetings.forms import MeetingForm
from meetings.models import Meeting
from users.models import User


# Create your tests here.

@pytest.fixture
def setup_data():
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)
    user = User.objects.create(username='testuser', password='Testpassword1')

    client = Client()
    client.force_login(user)

    return {
        'client': client,
        'user': user,
        'meeting_city': meeting_city,
        'meeting_region': meeting_region,
        'meeting_subregion': meeting_subregion
    }

@pytest.mark.django_db
def test_meeting_form_invalid(setup_data, field, value):
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


