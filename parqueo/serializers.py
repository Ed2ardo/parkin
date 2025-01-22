from rest_framework import serializers
from .models import RegistroParqueo


class RegistroParqueoSerializers(serializers.ModelSerializer):
    usuario_registra_nombre = serializers.CharField(
        source='usuario_registra.username', read_only=True)
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)

    class Meta:
        model = RegistroParqueo
        fields = ['id', 'placa', 'tipo_nombre', 'usuario_registra_nombre',
                  'fecha_entrada', 'fecha_salida', 'total_cobro', 'estado', 'cliente']
        read_only_fields = ('total_cobro', 'fecha_entrada', 'estado')

    def validate_placa(self, value):
        # 1. Consulta en la base de datos si ya existe un registro de parqueo con la misma placa
        # y que tenga el estado "activo".
        if RegistroParqueo.objects.filter(placa=value, estado="activo").exists():
            # 2. Si existe, lanza un error de validación con un mensaje explicativo.
            raise serializers.ValidationError(
                "Ya existe un registro activo para esta placa.")
        # 3. Si no hay conflicto, devuelve el valor de la placa.
        return value
