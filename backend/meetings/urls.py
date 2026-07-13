from django.urls import path, include
from rest_framework.routers import DefaultRouter
from meetings.views import (MeetingViewSet, 
                            get_meeting_subregion,
                            get_meeting_city,
                            meetings_map_view,
                            OutdatedMeetingsListView
                            )

router = DefaultRouter()


app_name = 'meetings'

router.register(r'meetings', MeetingViewSet, basename='meetings')

urlpatterns = [
    path('api/', include(router.urls)),
    path('get_cities/', get_meeting_city, name='get_cities'),
    path('get_subregions/', get_meeting_subregion, name='get_subregions'),
    path('meetings_map', meetings_map_view, name='meetings_map'),
    path('outdated_meetings/', OutdatedMeetingsListView.as_view(), name='outdated_meetings')
]
