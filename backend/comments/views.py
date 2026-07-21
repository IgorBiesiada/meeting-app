from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from comments.serializer import CommentSerializer
from comments.models import Comment
from meetings.models import Meeting
from rest_framework import generics

# Create your views here.

class AddCommentView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        meeting_id = self.kwargs['meeting_id']
        meeting = get_object_or_404(Meeting, id=meeting_id)
        serializer.save(author=self.request.user, meeting=meeting)


class CommentListView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        meeting_id = self.kwargs.get('meeting_id')
        meetings_comment = Comment.objects.filter(meeting=meeting_id)
        return meetings_comment