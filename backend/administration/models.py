from django.db import models
from .utils import validators

class Especialidade(models.Model):
    nome = models.CharField(max_length=128, null=False)

    def __str__(self):
        return self.nome

class Medico(models.Model):
    nome = models.CharField(max_length=128, null=False)
    crm = models.IntegerField(null=False, unique=True)
    email = models.EmailField(max_length=128, null=True, blank=True)
    telefone = models.CharField(max_length=11, blank=True, null=True, validators=[validators.RE_PHONE])
    especialidade = models.ForeignKey(Especialidade, on_delete=models.PROTECT)

    class Meta():
        verbose_name = 'Médico'
    
    def __str__(self):
        return self.nome