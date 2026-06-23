from django.urls import path
from participations.views import MeetingParticipationView

app_name = 'participations'

urlpatterns = [
    path('api/meeting/participation/', MeetingParticipationView.as_view(), name='meeting-participation')
]
