from rest_framework import viewsets, permissions
from .models import TipoVehiculo, EspacioParqueoConfig
from .serializers import TipoVehiculoSerializer, EspacioParqueoConfigSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite acceso de lectura a cualquier usuario autenticado,
    pero restringe modificaciones solo a administradores.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_superuser


class TipoVehiculoViewSet(viewsets.ModelViewSet):
    # Especifica qué registros de la base de datos se devolverán.
    queryset = TipoVehiculo.objects.all()
    # Define el serializer que se usará para convertir los datos del modelo en JSON y viceversa.
    serializer_class = TipoVehiculoSerializer
    permission_classes = [IsAdminOrReadOnly]


class EspacioParqueoConfigViewSet(viewsets.ModelViewSet):
    queryset = EspacioParqueoConfig.objects.all()
    serializer_class = EspacioParqueoConfigSerializer
    permission_classes = [IsAdminOrReadOnly]
