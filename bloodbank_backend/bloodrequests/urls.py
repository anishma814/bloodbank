from rest_framework.routers import DefaultRouter
from .views import BloodRequestViewSet, DonationRecordViewSet

router = DefaultRouter()
router.register('blood-requests', BloodRequestViewSet, basename='bloodrequest')
router.register('donation-records', DonationRecordViewSet, basename='donationrecord')

urlpatterns = router.urls