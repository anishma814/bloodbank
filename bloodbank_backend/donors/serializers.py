from rest_framework import serializers
from donors.models import Donor, MIN_DONATION_WEIGHT

class DonorSerializer(serializers.ModelSerializer):
    is_eligible = serializers.ReadOnlyField()

    class Meta:
        model = Donor
        fields = ['id', 'user', 'blood_group', 'weight', 'age', 'last_donation_date', 'is_eligible']
        read_only_fields = ['user']

    def validate_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError("Weight must be a positive number.")
        return value