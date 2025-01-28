from rest_framework import serializers
from .models import Ticket
from parqueo.models import RegistroParqueo


class TicketSerializer(serializers.ModelSerializer):
    placa = serializers.CharField(
        source="registro_parqueo.placa", read_only=True)
    tipo_vehiculo = serializers.CharField(
        source="registro_parqueo.tipo.nombre", read_only=True)
    fecha_entrada = serializers.DateTimeField(
        source="registro_parqueo.fecha_entrada", read_only=True)
    fecha_salida = serializers.DateTimeField(
        source="registro_parqueo.fecha_salida", read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "numero_ticket",
            "registro_parqueo",
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

    def validate(self, data):
        # Validar que el registro de parqueo esté asociado y facturado
        registro = data.get("registro_parqueo")
        if registro and registro.estado != "facturado":
            raise serializers.ValidationError(
                "El registro de parqueo no está en estado 'facturado'."
            )
        return data
