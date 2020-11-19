from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .serializers import EspecialidadeSerializer, MedicoSerializer
from administration.models import Especialidade, Medico

class EspecialidadeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EspecialidadeSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Especialidade.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']

class MedicoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MedicoSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Medico.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']
    
    def get_queryset(self):
        especialidades = self.request.query_params.getlist('especialidade')
        if especialidades:
            return self.queryset.filter(especialidade__id__in=especialidades)
        return self.queryset