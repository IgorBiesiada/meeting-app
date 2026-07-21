from django.urls import path
from comments.views import AddCommentView, CommentListView

app_name = 'comments'

urlpatterns = [
    path('api/add_comment/<int:meeting_id>/', AddCommentView.as_view(), name='add_comment'),
    path('api/comments_list/<int:meeting_id>/', CommentListView.as_view(), name='comments_list')
]
