from django.db import models
from config import settings
from cities_light.models import City, Region, SubRegion
from django.db.models import Avg
# Create your models here.

class Meeting(models.Model):
    title = models.CharField(max_length=100, verbose_name='Tytuł')
    description = models.TextField(max_length=500, verbose_name='Opis')
    date = models.DateField(verbose_name='Data wydarzenia')
    time = models.TimeField(verbose_name='Godzina wydarzenia')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Godzina utworzenia wydarzenia')
    number_of_seats = models.IntegerField(default=0, verbose_name='Liczba dostępnych miejsc')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, default=0, verbose_name='Cena')
    meeting_city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, default=None, verbose_name='Miasto')
    meeting_region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, default=None, verbose_name='Województwo')
    meeting_subregion = models.ForeignKey(SubRegion, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Powiat')

    def get_average_rating(self):
        ratings = self.ratings.all()
        if ratings.exists():
            return ratings.aggregate(Avg('rating'))['rating__avg']
        return 'Brak ocen'
