from django.urls import path
from users.views import RegisterView
from users.token_serializers import CustomTokenObtainPairView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]