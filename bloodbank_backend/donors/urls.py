from rest_framework.routers import DefaultRouter
from donors.views import DonorViewSet

router = DefaultRouter()
router.register('', DonorViewSet, basename='donor')

urlpatterns = router.urls