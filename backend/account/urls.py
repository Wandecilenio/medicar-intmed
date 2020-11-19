from django.urls import path, include
from rest_framework import routers

from .views import RegisterViewSet, CustomAuthToken, user_info

app_name = "account"

router = routers.DefaultRouter()
router.register(r'api/auth/register', RegisterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/auth/login/', CustomAuthToken.as_view()),
    path('api/auth/info/', user_info),
]