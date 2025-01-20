from django.contrib import admin
from .models import Vehiculo


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    # Muestra los campos clave en la lista del admin
    list_display = ('placa', 'tipo', 'cliente')
    # Permite búsquedas por placa, tipo y cliente
    search_fields = ('placa', 'tipo__nombre', 'cliente__nombre')
    # Agrega un filtro lateral basado en el tipo de vehículo
    list_filter = ('tipo',)
    list_per_page = 20
