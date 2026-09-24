from rest_framework.routers import DefaultRouter
from receivers.views import ReceiverViewSet

router = DefaultRouter()
router.register('', ReceiverViewSet, basename='receiver')

urlpatterns = router.urls