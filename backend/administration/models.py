from django.db import models
from django.contrib.postgres.fields import ArrayField

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

class Agenda(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.CASCADE, verbose_name="MÉDICO")
    dia = models.DateField(null=False, validators=[validators.NoPast])
    horarios = ArrayField(
        models.TimeField(auto_now=False, auto_now_add=False),
        null=False, blank=False,
        help_text="Insira os horários no formato Hora:Minuto separados por virgula",
        verbose_name="Horários"
    )
    def total_horarios(self):
        return len(self.horarios)
    total_horarios.short_description = 'TOTAL DE HORÁRIOS'
    
    def __str__(self):
        return f'{self.medico} - {self.dia}'

    class Meta():
        constraints = [
            models.UniqueConstraint(fields=['medico', 'dia'], name='unique_doctor_schedule_by_day')
        ]