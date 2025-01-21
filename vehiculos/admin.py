from django.contrib import admin
from .models import Vehiculo
from parqueo.models import RegistroParqueo


class RegistroInLine(admin.StackedInline):
    model = RegistroParqueo
    extra = 1
    fields = ('fecha_salida',
              'total_cobro', 'estado', 'usuario_registra')


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    # Muestra los campos clave en la lista del admin
    list_display = ('placa', 'tipo', 'cliente')
    # Permite búsquedas por placa, tipo y cliente
    search_fields = ('placa', 'tipo__nombre', 'cliente')
    # Agrega un filtro lateral basado en el tipo de vehículo
    list_filter = ('tipo',)
    list_per_page = 20
    inlines = [RegistroInLine]
