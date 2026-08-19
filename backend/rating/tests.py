import pytest
from rest_framework import status
from django.urls import reverse
from rating.models import Rating
from meetings.models import Meeting
from model_bakery import baker


@pytest.mark.django_db
def test_rating_meeting(auth_client1, user1):

    meeting = baker.make(Meeting)


    data = {
        "user": user1.id,
        "meeting": meeting.id,
        "rating": 3
    }

    url = reverse('rating:rating', kwargs={'pk': meeting.id})

    response = auth_client1.post(url, data=data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Rating.objects.count() == 1
    
