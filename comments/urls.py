from django.urls import path
from comments.views import AddCommentView

app_name = 'comments'

urlpatterns = [
    path('add_comment/<int:meeting_id>/', AddCommentView.as_view(), name='add_comment')
]
