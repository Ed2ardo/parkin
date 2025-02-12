from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import RegistroParqueo
from .serializers import RegistroParqueoSerializers
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.decorators import action
from tickets.models import Ticket
from django.db import transaction
# from rest_framework.exceptions import APIException


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "POST"]:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.is_superuser


class RegistroParqueoViewSet(viewsets.ModelViewSet):
    queryset = RegistroParqueo.objects.all()
    serializer_class = RegistroParqueoSerializers
    permission_classes = [IsAdminOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return Response(
                {"detail": "No tienes permiso para eliminar registros."},
                status=status.HTTP_403_FORBIDDEN
            )

        registro = self.get_object()
        registro.estado = "baja"
        registro.fecha_salida = now()
        registro.cobro = 0
        registro.save()

        return Response(
            {"detail": "El registro ha sido marcado como eliminado (baja)."},
            status=status.HTTP_204_NO_CONTENT
        )

    def partial_update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            generar_ticket = request.data.get("generar_ticket", False)

            # Actualizar estado si está en la solicitud
            estado = request.data.get("estado")
            if estado:
                instance.estado = estado

            if generar_ticket and not instance.ticket:
                with transaction.atomic():
                    ticket = Ticket.objects.create(
                        total=instance.calcular_total_cobro()
                    )  # Calcula el total directamente al crear el ticket
                    instance.ticket = ticket
                    instance.save()

            serializer = self.get_serializer(
                instance, data=request.data, partial=True)
            # 🚨 Se asegura de validar el serializer
            serializer.is_valid(raise_exception=True)
            serializer.save()  # Guardamos los cambio
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            # Manejo de excepciones más genérico
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
