from rest_framework import serializers
from .models import Tarifa


class TarifaSerializers(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(
        source='tipo_vehiculo.nombre', read_only=True)

    class Meta:
        model = Tarifa
        fields = ['id', 'tipo_vehiculo_nombre', 'costo_por_minuto']
