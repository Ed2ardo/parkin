from rest_framework import serializers
from .models import RegistroParqueo
from core.models import TipoVehiculo


class RegistroParqueoSerializers(serializers.ModelSerializer):
    usuario_registra_nombre = serializers.SerializerMethodField()
    tipo = serializers.PrimaryKeyRelatedField(
        queryset=TipoVehiculo.objects.all())
    tipo_nombre = serializers.CharField(source='tipo.nombre', read_only=True)

    class Meta:
        model = RegistroParqueo
        fields = [
            'id', 'placa', 'ticket', 'tipo', 'tipo_nombre', 'usuario_registra_nombre',
            'fecha_entrada', 'fecha_salida', 'total_cobro', 'estado', 'cliente'
        ]
        read_only_fields = ('total_cobro',)

    def get_usuario_registra_nombre(self, obj):
        """Devuelve el nombre del usuario que registró, si existe."""
        return obj.usuario_registra.username if obj.usuario_registra else "admin"

    def validate_placa(self, value):
        """Valida que no haya otro registro activo con la misma placa."""
        instance = self.instance
        query = RegistroParqueo.objects.filter(placa=value, estado="activo")

        if instance:
            query = query.exclude(id=instance.id)  # Excluye el registro actual

        if query.exists():
            raise serializers.ValidationError(
                "Ya existe un registro activo para esta placa.")

        return value
