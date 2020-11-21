from django.urls import path, include
from rest_framework import routers

from .views import RegisterViewSet, CustomAuthToken, user_info

app_name = "account"

router = routers.DefaultRouter()
router.register(r'auth/register', RegisterViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomAuthToken.as_view()),
    path('auth/info/', user_info),
]