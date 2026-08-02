from django.db import models
from users.models import User
from meetings.models import Meeting
# Create your models here.


class HistoryPayment(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.SET_NULL, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2) 
    currency = models.CharField(max_length=3, default='pln')
    meeting_title_snapshot = models.CharField(max_length=255) 
    stripe_session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.meeting_title_snapshot} - {self.amount_paid} PLN"
    