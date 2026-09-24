from rest_framework import viewsets, permissions
from donors.models import Donor
from donors.serializers import DonorSerializer

class DonorViewSet(viewsets.ModelViewSet):
    serializer_class = DonorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # donors can only see/edit their own profile
        return Donor.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
