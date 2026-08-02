from django.urls import path, include
from rest_framework.routers import DefaultRouter
from meetings.views import (MeetingViewSet, 
                            OutdatedMeetingsListView,
                            CutMeetingView
                            )

router = DefaultRouter()


app_name = 'meetings'

router.register(r'meetings', MeetingViewSet, basename='meetings')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/outdated_meetings/', OutdatedMeetingsListView.as_view(), name='outdated_meetings'),
    path('api/cut_meetings/', CutMeetingView.as_view(), name='cut_meetings')
]
