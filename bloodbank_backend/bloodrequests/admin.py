from django.contrib import admin
from .models import BloodRequest, DonationRecord
admin.site.register(BloodRequest)
admin.site.register(DonationRecord)
