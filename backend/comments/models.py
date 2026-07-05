from django.db import models
from backend.config import settings
from backend.meetings.models import Meeting


# Create your models here.

class Comment(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(max_length=100, verbose_name='komentarz')
    created_at = models.DateTimeField(auto_now_add=True)
