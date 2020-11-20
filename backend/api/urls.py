from django.urls import path, include
from rest_framework import routers

from .views import EspecialidadeViewSet, MedicoViewSet, ConsultaViewSet, AgendaViewSet

app_name = "api"

router = routers.DefaultRouter()
router.register(r'especialidades', EspecialidadeViewSet)
router.register(r'medicos', MedicoViewSet)
router.register(r'consultas', ConsultaViewSet)
router.register(r'agendas', AgendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]