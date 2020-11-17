from django.urls import path, include
from rest_framework import routers

from .views import EspecialidadeViewSet, MedicoViewSet

app_name = "api"

router = routers.DefaultRouter()
router.register(r'especialidades', EspecialidadeViewSet)
router.register(r'medicos', MedicoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]