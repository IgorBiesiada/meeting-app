from django.urls import path
from meetings.views import (MeetingListView,
                            MeetingAddView,
                            MeetingDetailView,
                            MeetingUpdateView,
                            DeleteMeetingView,
                            UserMeetingListView,
                            get_meeting_subregion,
                            get_meeting_city,
                            meetings_map_view,
                            OutdatedMeetingsListView
                            )

app_name = 'meetings'

urlpatterns = [
    path('meetings/', MeetingListView.as_view(), name='meetings'),
    path('add_meeting/', MeetingAddView.as_view(), name='add_meeting'),
    path('<int:pk>/meeting_detail/', MeetingDetailView.as_view(), name='meeting_detail'),
    path('<int:pk>', MeetingUpdateView.as_view(), name='meeting_edit'),
    path('<int:pk>/delete/', DeleteMeetingView.as_view(), name='meeting_delete'),
    path('user_meetings/', UserMeetingListView.as_view(), name='user_meetings'),
    path('get_cities/', get_meeting_city, name='get_cities'),
    path('get_subregions/', get_meeting_subregion, name='get_subregions'),
    path('meetings_map', meetings_map_view, name='meetings_map'),
    path('outdated_meetings/', OutdatedMeetingsListView.as_view(), name='outdated_meetings')
]
