from rest_framework import serializers
from .models import RegistroParqueo
from core.models import TipoVehiculo


class RegistroParqueoSerializers(serializers.ModelSerializer):
    usuario_registra_nombre = serializers.CharField(
        source='usuario_registra.username', read_only=True)
    tipo = serializers.PrimaryKeyRelatedField(
        queryset=TipoVehiculo.objects.all())
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)

    class Meta:
        model = RegistroParqueo
        fields = ['id', 'placa', 'tipo', 'tipo_nombre', 'usuario_registra_nombre',
                  'fecha_entrada', 'fecha_salida', 'total_cobro', 'estado', 'cliente']
        read_only_fields = ('total_cobro', 'fecha_entrada', 'fecha_salida')

    def validate_placa(self, value):
        instance = self.instance  # Obtiene la instancia si se está editando
        query = RegistroParqueo.objects.filter(placa=value, estado="activo")

        if instance:
            # Excluye el registro actual de la validación
            query = query.exclude(id=instance.id)

        if query.exists():
            raise serializers.ValidationError(
                "Ya existe un registro activo para esta placa.")

        return value
