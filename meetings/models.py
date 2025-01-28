from django.db import models
from config import settings
from cities_light.models import City, Region, SubRegion

# Create your models here.

class Meeting(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    number_of_seats = models.IntegerField(default=0)
    waiting_people = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    meeting_city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, default=None)
    meeting_region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, default=None)
    meeting_subregion = models.ForeignKey(SubRegion, on_delete=models.SET_NULL, null=True, blank=True)
