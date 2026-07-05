from django.contrib.auth.models import AbstractUser
from django.db import models
from cities_light.models import City, Region

# Create your models here.

class User(AbstractUser):
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, default=None)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, default=None)
    email = models.EmailField(unique=True)
    is_baned = models.BooleanField(default=False)
