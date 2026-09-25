from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from bloodrequests.models import BloodRequest, DonationRecord
from bloodrequests.serializers import BloodRequestSerializer, DonationRecordSerializer
from donors.models import Donor, MIN_DONATION_WEIGHT
from receivers.models import Receiver


class BloodRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BloodRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # receivers see only their own requests; donors see all pending ones to browse
        if self.request.user.role == 'receiver':
            return BloodRequest.objects.filter(receiver__user=self.request.user)
        return BloodRequest.objects.filter(status='pending')

    def perform_create(self, serializer):
        receiver = Receiver.objects.get(user=self.request.user)
        serializer.save(receiver=receiver, hospital_name_snapshot=receiver.hospital_name)

    @action(detail=True, methods=['get'])
    def matches(self, request, pk=None):
        """Return eligible donors for this specific request."""
        blood_request = self.get_object()
        eligible_donors = Donor.objects.filter(
            blood_group=blood_request.blood_group_needed,
            weight__gte=MIN_DONATION_WEIGHT,
        )
        # filter out anyone who donated in the last 90 days (uses the model property)
        eligible_donors = [d for d in eligible_donors if d.is_eligible]

        from donors.serializers import DonorSerializer
        serializer = DonorSerializer(eligible_donors, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def offer(self, request, pk=None):
        """Receiver selects a donor from the matches list and creates a DonationRecord."""
        blood_request = self.get_object()

        if blood_request.receiver.user != request.user:
            return Response({"error": "Not your request."}, status=status.HTTP_403_FORBIDDEN)

        donor_id = request.data.get('donor_id')
        if not donor_id:
            return Response({"error": "donor_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            donor = Donor.objects.get(id=donor_id)
        except Donor.DoesNotExist:
            return Response({"error": "Donor not found."}, status=status.HTTP_404_NOT_FOUND)

        # Prevent duplicate offers to the same donor for the same request
        existing = DonationRecord.objects.filter(donor=donor, request=blood_request).first()
        if existing:
            return Response(
                {"error": "An offer already exists for this donor and request.", "record": DonationRecordSerializer(existing).data},
                status=status.HTTP_400_BAD_REQUEST
            )

        record = DonationRecord.objects.create(
            donor=donor,
            request=blood_request,
            status='offered'
        )
        serializer = DonationRecordSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DonationRecordViewSet(viewsets.ModelViewSet):
    serializer_class = DonationRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'donor':
            return DonationRecord.objects.filter(donor__user=self.request.user)
        return DonationRecord.objects.filter(request__receiver__user=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        record = self.get_object()
        if record.donor.user != request.user:
            return Response({"error": "Not your donation record."}, status=status.HTTP_403_FORBIDDEN)
        record.status = 'accepted'
        record.save()
        record.request.status = 'fulfilled'
        record.request.save()
        return Response(self.get_serializer(record).data)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        record = self.get_object()
        if record.donor.user != request.user:
            return Response({"error": "Not your donation record."}, status=status.HTTP_403_FORBIDDEN)
        record.status = 'declined'
        record.save()
        return Response(self.get_serializer(record).data)
