from django.urls import path
from participations.views import MeetingParticipationView

app_name = 'participations'

urlpatterns = [
    path('participation/', MeetingParticipationView.as_view(), name='participation')
]
