from rest_framework import viewsets, filters
from .serializers import EspecialidadeSerializer
from administration.models import Especialidade

class EspecialidadeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EspecialidadeSerializer
    queryset = Especialidade.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome']