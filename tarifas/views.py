from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Tarifa
from .serializers import TarifaSerializers


class EsAdminPermission(IsAuthenticated):
    """Permite solo a administradores modificar las tarifas."""

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_superuser


class TarifaViewSet(viewsets.ModelViewSet):
    queryset = Tarifa.objects.all()
    serializer_class = TarifaSerializers

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [EsAdminPermission()]
        return [IsAuthenticated()]
