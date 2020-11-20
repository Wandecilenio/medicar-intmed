from rest_framework import serializers
import datetime

from administration.models import Especialidade, Medico, Agenda
from .models import Consulta

class EspecialidadeSerializer(serializers.ModelSerializer):
    class Meta():
        model = Especialidade
        fields = '__all__'

class MedicoSerializer(serializers.ModelSerializer):
    especialidade = EspecialidadeSerializer(read_only=True)
    
    class Meta():
        model = Medico
        exclude = ['telefone', 'email']

class ConsultaSerializer(serializers.ModelSerializer):
    medico = MedicoSerializer(read_only=True)
    dia = serializers.SerializerMethodField('get_dia')
    
    class Meta():
        model = Consulta
        fields = ('id', 'dia', 'horario', 'data_agendamento', 'medico',)

    def get_dia(self, consulta):
        return consulta.agenda.dia

class AgendaSerializer(serializers.ModelSerializer):
    medico = MedicoSerializer(read_only=True)
    
    class Meta():
        fields = ('id', 'medico', 'dia', 'horarios')
        model = Agenda