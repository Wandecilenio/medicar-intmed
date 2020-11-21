from django.db.models import Q
from django.db.models.functions import Concat
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
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

class ConsultaViewSet(viewsets.ModelViewSet):
    serializer_class = ConsultaSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Consulta.objects.all()
    allowed_methods = ('GET', 'POST', 'DELETE')
    
    def get_queryset(self):
        query_agenda_passada = Q(agenda__dia__lt=datetime.date.today())
        query_horario_passado = Q(Q(agenda__dia__lte=datetime.date.today()) & Q(horario__lt=datetime.datetime.now().time()))

        queryset = self.queryset.filter(user=self.request.user)
        queryset = queryset.exclude(query_agenda_passada | query_horario_passado)
        queryset = queryset.order_by('agenda__dia', 'horario')
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        agenda_id = request.data.get('agenda_id')
        horario = request.data.get('horario')
        agenda = Agenda.objects.filter(pk=agenda_id).first()

        # A Agenda e obrigatoria
        if agenda is None:
            raise ValidationError("Agenda não encontrada")

        # Nao pode marcar consulta numa agenda antiga
        if agenda.dia < datetime.date.today():
            raise ValidationError("Não é possível marcar uma consulta para uma agenda que já passou")
        
        # Nao pode marcar consulta num horario que ja passou
        if datetime.datetime.strptime(f'{agenda.dia} {horario}', f'%Y-%m-%d %H:%M:%S') < datetime.datetime.now():
            raise ValidationError("Não é possível marcar uma consulta para um horário que já passou")
        
        # Nao se pode marcar uma consulta se o horario passado naquela agenda, esta sendo usado
        consulta = Consulta.objects.filter(agenda__id=agenda_id, horario=horario).first()
        if consulta is not None:
            raise ValidationError("Esse horário dessa agenda já esta preenchido, por favor selecione outro")

        nova_consulta = Consulta.objects.create(
            medico = agenda.medico,
            user = request.user,
            agenda = agenda,
            horario = horario,
            data_agendamento = datetime.datetime.now()
        )

        serializer = ConsultaSerializer(nova_consulta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        consulta = Consulta.objects.filter(pk=kwargs.get('pk'), user=request.user).first()
        if consulta is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Nao pode marcar consulta num horario que ja passou
        if datetime.datetime.strptime(f'{consulta.agenda.dia} {consulta.horario}', f'%Y-%m-%d %H:%M:%S') < datetime.datetime.now():
            raise ValidationError("Não é possível desmarcar uma consulta de um horário que já passou")

        consulta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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