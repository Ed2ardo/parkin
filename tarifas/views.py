from rest_framework import viewsets
from .models import Tarifa
from .serializers import TarifaSerializers


class TarifaViewSet(viewsets.ModelViewSet):
    queryset = Tarifa.objects.all()
    serializer_class = TarifaSerializers
