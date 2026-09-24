from rest_framework import serializers
from bloodrequests.models import BloodRequest, DonationRecord
from donors.serializers import DonorSerializer

class BloodRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = ['id', 'receiver', 'hospital_name_snapshot', 'blood_group_needed', 'units_needed', 'status', 'created_at']
        read_only_fields = ['receiver', 'hospital_name_snapshot', 'status', 'created_at']


class DonationRecordSerializer(serializers.ModelSerializer):
    donor_detail = DonorSerializer(source='donor', read_only=True)
    request_detail = BloodRequestSerializer(source='request', read_only=True)

    class Meta:
        model = DonationRecord
        fields = ['id', 'donor', 'donor_detail', 'request', 'request_detail', 'status', 'date']
        read_only_fields = ['date']