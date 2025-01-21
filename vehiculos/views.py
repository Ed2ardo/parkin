from rest_framework import viewsets
from .models import Vehiculo
from .serializers import VehiculoSerializers


class VehiculoViewSet(viewsets.ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializers
