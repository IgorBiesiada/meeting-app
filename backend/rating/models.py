from django.db import models
from meetings.models import Meeting
from users.models import User


# Create your models here.

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='ratings')
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])

    class Meta:
        unique_together = ('meeting', 'user')
        