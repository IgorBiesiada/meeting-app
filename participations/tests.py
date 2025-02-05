from cities_light.models import Country, Region, City, SubRegion
from django.test import TestCase
import pytest

from meetings.models import Meeting
from participations.models import Participation
from users.models import User
from django.urls import reverse

# Create your tests here.

@pytest.mark.django_db
def test_participation_join_meeting(client):
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

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

    client.login(username="testuser", password="Testpassword1")



    url = reverse('participation')
    response = client.post(url, {
        'meeting_id': meeting.id,
        'action': 'join',
    })

    assert response.status_code == 302

    participation = Participation.objects.filter(meeting=meeting, participant=user).first()
    assert participation is not None
    assert participation.is_waiting == False

    meeting.refresh_from_db()
    assert meeting.number_of_seats == 9

@pytest.mark.django_db
def test_participation_waiting_people(client):
    country = Country.objects.create(name="Polska")
    meeting_region = Region.objects.create(name='Województwo', country=country)
    meeting_city = City.objects.create(name='Miasto', region=meeting_region, country=country)
    meeting_subregion = SubRegion.objects.create(name='Powiat', region=meeting_region, country=country)

    user = User.objects.create_user(username="testuser",
                                    first_name="testfirstname",
                                    last_name="testlastname",
                                    email="test@email.com",
                                    password="Testpassword1"
                                    )

    meeting = Meeting.objects.create(title='testtitle',
                                     description='testdescription',
                                     date='2025-02-05',
                                     time='14:00:00',
                                     number_of_seats=0,
                                     price=0,
                                     created_by=user,
                                     meeting_city=meeting_city,
                                     meeting_subregion=meeting_subregion,
                                     meeting_region=meeting_region
                                     )

    client.login(username="testuser", password="Testpassword1")

    url = reverse('participation')
    response = client.post(url, {
        'meeting_id': meeting.id,
        'action': 'join',
    })

    assert response.status_code == 302

    participation = Participation.objects.filter(meeting=meeting, participant=user).first()
    assert participation is not None
    assert participation.is_waiting == True

    meeting.refresh_from_db()
    assert meeting.waiting_people == 1
