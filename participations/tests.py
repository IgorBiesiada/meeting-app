from cities_light.models import Country, Region, City, SubRegion

import pytest
from django.contrib.auth import get_user_model
from meetings.models import Meeting
from participations.models import Participation
from users.models import User
from django.urls import reverse

# Create your tests here.

@pytest.mark.django_db
def test_meeting_participation_join_and_leave(client):
    country = Country.objects.create(name="Polska")
    region = Region.objects.create(name='Województwo', country=country)
    city = City.objects.create(name='Miasto', region=region, country=country)
    subregion = SubRegion.objects.create(name='Powiat', region=region, country=country)

    owner = User.objects.create_user(username='testuser',
                                     first_name='testfirstname',
                                     last_name='testlastname',
                                     email='test@email.com',
                                     password='Testpassword1')

    participant = User.objects.create_user(username='testuser2',
                                           first_name='testfirstname',
                                           last_name='testlastname',
                                           email='test2@email.com',
                                           password='Testpassword2')

    meeting = Meeting.objects.create(
        title='Test Meeting',
        description='Test Description',
        date='2025-02-05',
        time='14:00:00',
        number_of_seats=5,
        price=0,
        created_by=owner,
        meeting_city=city,
        meeting_subregion=subregion,
        meeting_region=region
    )

    client.login(username="testuser2", password="Testpassword2")  # Używamy uczestnika,
    url = reverse('participation')

    # Dołączenie do spotkania
    response = client.post(url, {'meeting_id': meeting.id, 'action': 'join'})
    assert response.status_code == 302
    assert Participation.objects.filter(meeting=meeting, participant=participant).exists()
    meeting.refresh_from_db()
    assert meeting.number_of_seats == 4

    # Opuszczenie spotkania
    response = client.post(url, {'meeting_id': meeting.id, 'action': 'leave'})
    assert response.status_code == 302
    assert not Participation.objects.filter(meeting=meeting, participant=participant).exists()
    meeting.refresh_from_db()
    assert meeting.number_of_seats == 5
