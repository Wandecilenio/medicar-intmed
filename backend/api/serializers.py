from rest_framework import serializers

from administration.models import Especialidade, Medico

class EspecialidadeSerializer(serializers.ModelSerializer):
    class Meta():
        model = Especialidade
        fields = '__all__'

class MedicoSerializer(serializers.ModelSerializer):
    especialidade = EspecialidadeSerializer(read_only=True)
    
    class Meta():
        model = Medico
        exclude = ['telefone', 'email']