from django.db import models
from receivers.models import Receiver
from donors.models import BLOOD_GROUP_CHOICES

class BloodRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('matched', 'Matched'),
        ('fulfilled', 'Fulfilled'),
    )
    receiver = models.ForeignKey(Receiver, on_delete=models.CASCADE, related_name='requests')
    hospital_name_snapshot = models.CharField(max_length=100, blank=True)  # NEW FIELD
    blood_group_needed = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    units_needed = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request by {self.receiver.user.username} for {self.blood_group_needed}"


class DonationRecord(models.Model):
    STATUS_CHOICES = (
        ('offered', 'Offered'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('completed', 'Completed'),
    )
    donor = models.ForeignKey('donors.Donor', on_delete=models.CASCADE, related_name='donations')
    request = models.ForeignKey(BloodRequest, on_delete=models.CASCADE, related_name='donation_records')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='offered')
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.donor.user.username} -> {self.request}"