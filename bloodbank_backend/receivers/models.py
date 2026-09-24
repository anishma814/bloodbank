from django.db import models
from django.conf import settings

class Receiver(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hospital_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.user.username} - {self.hospital_name}"
