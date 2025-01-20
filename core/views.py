from rest_framework import viewsets
from .models import TipoVehiculo, EspacioParqueoConfig
from .serializers import TipoVehiculoSerializer, EspacioParqueoConfigSerializer


class TipoVehiculoViewSet(viewsets.ModelViewSet):
    # Especifica qué registros de la base de datos se devolverán.
    queryset = TipoVehiculo.objects.all()
    # Define el serializer que se usará para convertir los datos del modelo en JSON y viceversa.
    serializer_class = TipoVehiculoSerializer


class EspacioParqueoConfigViewSet(viewsets.ModelViewSet):
    queryset = EspacioParqueoConfig.objects.all()
    serializer_class = EspacioParqueoConfigSerializer
