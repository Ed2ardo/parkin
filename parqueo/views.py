from rest_framework import viewsets
from .models import RegistroParqueo
from .serializers import RegistroParqueoSerializers


class RegistroParqueoViewSet(viewsets.ModelViewSet):
    queryset = RegistroParqueo.objects.all()
    serializer_class = RegistroParqueoSerializers
