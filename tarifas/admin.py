from django.contrib import admin
from .models import Tarifa


@admin.register(Tarifa)
class TarifaAdmin(admin.ModelAdmin):
    # Campos clave a mostrar en la lista del admin
    list_display = ('tipo_vehiculo', 'costo_por_minuto')
    # Permite buscar por el nombre del tipo de vehículo
    search_fields = ('tipo_vehiculo__nombre',)
    list_filter = ('tipo_vehiculo',)  # Filtro lateral por tipo de vehículo
    list_per_page = 20
