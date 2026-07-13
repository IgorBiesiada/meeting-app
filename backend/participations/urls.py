from django.urls import path
from participations.views import MeetingParticipationView

app_name = 'participations'

urlpatterns = [
    path('meeting/<int:meeting_id>/participation/', MeetingParticipationView.as_view(), name='meeting-participation')
]
