from django.db import models
from django.conf import settings
from datetime import date, timedelta

MIN_DONATION_WEIGHT = 50  # kg, standard eligibility threshold

BLOOD_GROUP_CHOICES = (
    ('A+', 'A+'), ('A-', 'A-'),
    ('B+', 'B+'), ('B-', 'B-'),
    ('AB+', 'AB+'), ('AB-', 'AB-'),
    ('O+', 'O+'), ('O-', 'O-'),
)

class Donor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    age = models.PositiveIntegerField()
    last_donation_date = models.DateField(null=True, blank=True)

    @property
    def is_eligible(self):
        if self.weight < MIN_DONATION_WEIGHT:
            return False
        if self.last_donation_date:
            if date.today() - self.last_donation_date < timedelta(days=90):
                return False
        return True

    def __str__(self):
        return f"{self.user.username} - {self.blood_group}"
