from django.core.validators import RegexValidator

RE_PHONE = RegexValidator(regex=r'^\d{10,11}$', message="Número de telefone no máximo 11 digitos")