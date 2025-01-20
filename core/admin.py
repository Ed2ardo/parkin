from django.contrib import admin
from .models import TipoVehiculo, EspacioParqueoConfig


@admin.register(TipoVehiculo)
class TipoVehiculoAdmin(admin.ModelAdmin):
    list_display = ('nombre',)  # Puedes agregar más campos si fuera necesario
    search_fields = ('nombre',)
    list_per_page = 20


@admin.register(EspacioParqueoConfig)
class EspacioParqueoConfigAdmin(admin.ModelAdmin):
    list_display = ('tipo_espacio', 'total_espacios',
                    'espacios_ocupados', 'espacios_disponibles')
    # Búsqueda basada en el nombre del tipo de espacio
    search_fields = ('tipo_espacio__nombre',)
    list_filter = ('tipo_espacio',)
    list_per_page = 20

    def espacios_ocupados(self, obj):
        return obj.espacios_ocupados  # Llama al método de propiedad del modelo

    def espacios_disponibles(self, obj):
        return obj.espacios_disponibles  # Llama al método de propiedad del modelo
