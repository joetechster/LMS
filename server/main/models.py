from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    passport = models.ImageField(upload_to='passports/', blank=True, verbose_name="Passport (Photo)")
    address = models.TextField(blank=True, verbose_name="Address")

    def __str__(self):
        return self.email
      
    class Meta:
      verbose_name = "User"
      verbose_name_plural = "Users"
    