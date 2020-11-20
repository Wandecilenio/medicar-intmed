from django.db.models import Count
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
import datetime

from .serializers import EspecialidadeSerializer, MedicoSerializer, ConsultaSerializer, AgendaSerializer
from administration.models import Especialidade, Medico, Agenda
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

class AgendaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AgendaSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Agenda.objects.all()
    
    def get_queryset(self):
        queryset = self.queryset
        
        medicos = self.request.query_params.getlist('medico')
        if medicos:
            queryset = queryset.filter(medico__id__in=medicos)
        
        especialidades = self.request.query_params.getlist('especialidade')
        if especialidades:
            queryset = queryset.filter(medico__especialidade__id__in=especialidades)

        data_inicio = self.request.query_params.get('data_inicio')
        data_final = self.request.query_params.get('data_final')

        if data_inicio is not None and data_final is not None:
            queryset = queryset.filter(dia__range=(data_inicio, data_final))
        else:
            queryset = queryset.filter(dia__gte=datetime.datetime.now().strftime('%Y-%m-%d'))
        
        queryset = queryset.order_by('dia')

        agendas = []
        for agenda in queryset.values():
            consultas = Consulta.objects.filter(agenda__id=agenda['id'], horario__in=agenda['horarios']).values()
            horarios_marcados = [consulta['horario'] for consulta in consultas]
            total_consultas_agendadas = len(horarios_marcados)
            
            # Vamos remover os horarios que ja foram marcados
            horarios_disponiveis = [horario for horario in agenda['horarios'] if horario not in horarios_marcados]

            # Se a agenda for de hoje, entao temos que remover os horarios que ja passaram
            if agenda['dia'] == datetime.date.today():
                horarios_disponiveis = [horario for horario in horarios_disponiveis if horario > datetime.datetime.now().time()]

            # Se todos os horarios ja passaram ou estao ocupados, entao nao retorna
            if len(horarios_disponiveis) == 0:
                continue

            agenda['horarios'] = horarios_disponiveis
            
            # Vamos preencher manualmente o medico
            medico = Medico.objects.filter(pk=agenda['medico_id'])
            medico_serializer = MedicoSerializer(medico[0])
            agenda['medico'] = medico_serializer.data
            agenda.pop('medico_id')

            agendas.append(agenda)

        return agendas