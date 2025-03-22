from rest_framework import serializers
from .models import Tarifa
from decimal import Decimal


class TarifaSerializers(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(
        source='tipo_vehiculo.nombre', read_only=True)
    costo_por_minuto = serializers.DecimalField(
        max_digits=6,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    class Meta:
        model = Tarifa
        fields = ['id', 'tipo_vehiculo', 'tipo_vehiculo_nombre', 'costo_por_minuto']
