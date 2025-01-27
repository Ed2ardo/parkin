from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import RegistroParqueo
from .serializers import RegistroParqueoSerializers
from django.utils.timezone import now



class RegistroParqueoViewSet(viewsets.ModelViewSet):
    queryset = RegistroParqueo.objects.all()
    serializer_class = RegistroParqueoSerializers

    # ajusta la vista para que permita cambiar el estado del registro a "baja" en lugar de eliminarlo, fecha_salida y cobro.
    def destroy(self, request, *args, **kwargs):
        registro = self.get_object()
        # Cambiar el estado a "baja", establecer fecha de salida y cobro en 0
        registro.estado = "baja"
        registro.fecha_salida = now()  # Fecha actual como fecha de salida
        registro.cobro = 0  # Registrar el cobro como 0
        registro.save()
        return Response(
            {"detail": "El registro ha sido marcado como eliminado (baja)."},
            status=status.HTTP_204_NO_CONTENT
        )
