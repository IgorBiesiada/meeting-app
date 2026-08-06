from django.db import models
from config import settings
from meetings.models import Meeting


# Create your models here.

class Participation(models.Model):
    participant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='participations')

    class Meta:
        unique_together = ('meeting', 'participant')
