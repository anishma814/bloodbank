from rest_framework import serializers
from receivers.models import Receiver

class ReceiverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receiver
        fields = ['id', 'user', 'hospital_name', 'contact_number']
        read_only_fields = ['user']