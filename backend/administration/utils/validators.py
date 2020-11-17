from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from datetime import date

RE_PHONE = RegexValidator(regex=r'^\d{10,11}$', message="Número de telefone no máximo 11 digitos")

def NoPast(value):
    if value < date.today():
        raise ValidationError("A data passada não pode ser menor que hoje!")