from rest_framework import viewsets, permissions
from receivers.models import Receiver
from receivers.serializers import ReceiverSerializer

class ReceiverViewSet(viewsets.ModelViewSet):
    serializer_class = ReceiverSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Receiver.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)