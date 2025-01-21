from rest_framework import serializers
from .models import RegistroParqueo


class RegistroParqueoSerializers(serializers.ModelSerializer):
    usuario_registra_nombre = serializers.CharField(source='User.name')

    class Meta:
        model = RegistroParqueo
        fields = ['id', 'vehiculo', 'usuario_registra_nombre',
                  'fecha_entrada', 'fecha_salida', 'total_cobro', 'estado']
