from django.contrib import admin

from .models import Especialidade, Medico

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'crm', 'telefone')
    search_fields = ['nome', 'crm']
    list_filter = ['especialidade']

admin.site.register(Especialidade)