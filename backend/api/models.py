from django.db import models

from administration.models import Medico, Agenda
from account.models import User

class Consulta(models.Model):
    medico = models.ForeignKey(Medico, on_delete=models.PROTECT, verbose_name="Médico")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    agenda = models.ForeignKey(Agenda, on_delete=models.CASCADE)
    horario = models.TimeField(null=False, blank=False)
    data_agendamento = models.DateTimeField(null=False, blank=False, auto_now_add=True)