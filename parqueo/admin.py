from django.contrib import admin
from .models import RegistroParqueo


@admin.register(RegistroParqueo)
class RegistroParqueoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'tipo', 'fecha_entrada', 'fecha_salida',
                    'total_cobro', 'estado', 'cliente')
    search_fields = ('placa', 'usuario_registra__username')
    list_filter = ('estado', 'fecha_entrada', 'usuario_registra')
    list_per_page = 20
    # No editable desde el admin
    readonly_fields = ('fecha_entrada', 'total_cobro')
    # raw_id_fields = ('vehiculo',)  # Convierte el campo de búsqueda en un buscador más práctico
