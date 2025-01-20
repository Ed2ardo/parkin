from rest_framework import serializers
from .models import TipoVehiculo, EspacioParqueoConfig


class TipoVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoVehiculo
        fields = ['id', 'nombre']


class EspacioParqueoConfigSerializer(serializers.ModelSerializer):
    tipo_espacio_nombre = serializers.CharField(
        source='tipo_espacio.nombre', read_only=True)
    espacios_ocupados = serializers.IntegerField(read_only=True)
    espacios_disponibles = serializers.IntegerField(read_only=True)

    class Meta:
        model = EspacioParqueoConfig
        fields = ['id', 'tipo_espacio',
                  'tipo_espacio_nombre', 'total_espacios', 'espacios_ocupados', 'espacios_disponibles']
