from rest_framework import viewsets
from .models import RegistroParqueo
from .serializers import RegistroParqueoSerializers


class RegistroParqueoViewSet(viewsets.ModelViewSet):
    queryset = RegistroParqueo.objects.all()
    serializer_class = RegistroParqueoSerializers

    # ajusta la vista para que permita cambiar el estado del registro a "baja" en lugar de eliminarlo.
    def destroy(self, request, *args, **kwargs):
        registro = self.get_object()
        # Cambia el estado a "baja" en lugar de eliminarlo
        registro.estado = "baja"
        registro.save()
        return Response(
            {"detail": "El registro ha sido marcado como eliminado (baja)."},
            status=status.HTTP_204_NO_CONTENT
        )
