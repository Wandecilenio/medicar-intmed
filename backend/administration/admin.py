from django.contrib import admin

from .models import Especialidade, Medico, Agenda

class AgendaInline(admin.TabularInline):
    model = Agenda
    extra = 1

@admin.register(Medico)
class MedicoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'crm', 'telefone')
    search_fields = ['nome', 'crm']
    list_filter = ['especialidade']
    inlines = [AgendaInline]

@admin.register(Agenda)
class AgendaAdmin(admin.ModelAdmin):
    list_display = ('medico', 'dia', 'total_horarios')
    list_filter = ['medico']
    fields = ('medico', 'dia', 'horarios')

admin.site.register(Especialidade)