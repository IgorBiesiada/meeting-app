from django.test import TestCase
import pytest
# Create your tests here.
from . models import User, Meeting, Rating
from django.urls import reverse
@pytest.mark.django_db
def test_add_rating_view(client):
    # Tworzenie użytkownika
    user = User.objects.create_user(username="testuser", password="Testpassword1")

    # Logowanie użytkownika
    client.login(username="testuser", password="Testpassword1")

    # Tworzenie spotkania
    meeting = Meeting.objects.create(
        title="Test Meeting",
        description="Opis testowego spotkania",
        date="2025-02-10",
        time="15:00:00",
        number_of_seats=10,
        price=0,
        created_by=user
    )

    # URL widoku dodawania oceny
    url = reverse('rating_add', kwargs={'pk': meeting.id})


    data = {
        "rating": 5,
        "comment": "Bardzo dobre spotkanie!"
    }


    response = client.post(url, data)
    assert response.status_code == 302

    rating = Rating.objects.filter(meeting=meeting, user=user).first()
    assert rating is not None
    assert rating.rating == 5
    assert rating.comment == "Bardzo dobre spotkanie!"