from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
import datetime

from .serializers import EspecialidadeSerializer, MedicoSerializer, ConsultaSerializer
from administration.models import Especialidade, Medico
from account.models import User
from .models import Consulta

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

class ConsultaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Consulta.objects.all()
    
    def get_queryset(self):
        user = User.objects.get(email=self.request.user)
        queryset = self.queryset.filter(user=user).exclude(agenda__dia__lt=datetime.date.today())
        queryset = queryset.exclude(horario__lt=datetime.datetime.now()).order_by('agenda__dia', 'horario')
        return queryset