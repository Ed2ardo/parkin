from rest_framework import serializers
from .models import Ticket
from parqueo.models import RegistroParqueo


class TicketSerializer(serializers.ModelSerializer):
    # Obtener datos del RegistroParqueo asociado usando la relación inversa
    placa = serializers.SerializerMethodField()
    tipo_vehiculo = serializers.SerializerMethodField()
    fecha_entrada = serializers.SerializerMethodField()
    fecha_salida = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "id",
            "numero_ticket",
            "placa",
            "tipo_vehiculo",
            "fecha_entrada",
            "fecha_salida",
            "total",
            "fecha_emision",
            "cliente",
            "notas_legales",
            "estado",
        ]
        read_only_fields = ["numero_ticket", "fecha_emision", "total"]

    def get_registro_parqueo(self, obj):
        """Obtiene el RegistroParqueo asociado al ticket."""
        return RegistroParqueo.objects.filter(ticket=obj).first()

    def get_placa(self, obj):
        registro = self.get_registro_parqueo(obj)
        return registro.placa if registro else None

    def get_tipo_vehiculo(self, obj):
        registro = self.get_registro_parqueo(obj)
        return registro.tipo.nombre if registro else None

    def get_fecha_entrada(self, obj):
        registro = self.get_registro_parqueo(obj)
        return registro.fecha_entrada if registro else None

    def get_fecha_salida(self, obj):
        registro = self.get_registro_parqueo(obj)
        return registro.fecha_salida if registro else None
