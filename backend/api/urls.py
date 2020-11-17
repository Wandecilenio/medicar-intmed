from django.urls import path, include
from rest_framework import routers

from .views import EspecialidadeViewSet

app_name = "api"

router = routers.DefaultRouter()
router.register(r'especialidades', EspecialidadeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]