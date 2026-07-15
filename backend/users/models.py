from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

class User(AbstractUser):
    city = models.CharField(max_length=50)
    region = models.CharField(max_length=50)
    lat = models.CharField(max_length=50)
    lon = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    is_baned = models.BooleanField(default=False)
