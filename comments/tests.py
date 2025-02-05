from cities_light.models import Country, Region, City, SubRegion
from django.test import TestCase
import pytest
from django.urls import reverse
from comments.models import Comment
from meetings.models import Meeting
from users.models import User


# Create your tests here.

@pytest.mark.django_db
def test_comment():
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

    comment = Comment.objects.create(
        meeting=meeting,
        author=user,
        text='Test message'
    )

    Comment.objects.count() == 1
    assert comment.meeting == meeting
    assert comment.author == user
    assert comment.text == ("Test message")
    assert comment.created_at is not None

@pytest.mark.django_db
def test_meeting_comment_create_view(client):
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

    url = reverse('add_comment', kwargs={'meeting_id': meeting.id})

    client.login(username='testuser', password='Testpassword1')

    response = client.post(url, {'text': 'testcontent'})

    assert response.status_code == 302
    assert Comment.objects.count() == 1

    comment = Comment.objects.first()
    assert comment.author == user
    assert comment.meeting == meeting
    assert comment.text == 'testcontent'
