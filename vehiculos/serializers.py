from rest_framework import serializers
from .models import Vehiculo


class VehiculoSerializers(serializers.ModelSerializer):
    tipo_nombre = serializers.CharField(
        source='tipo.nombre', read_only=True)

    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'tipo_nombre', 'cliente']
