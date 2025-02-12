from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer
from parqueo.models import RegistroParqueo


class EsAdminPermission(IsAuthenticated):
    """Permite solo a administradores realizar ciertas acciones."""

    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.is_superuser


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

    def get_permissions(self):
        if self.action in ['destroy']:  # Solo admin puede cancelar tickets
            return [EsAdminPermission()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        """
        Al crear un ticket:
        1. Verifica que el registro de parqueo esté facturado.
        2. Genera un ticket asociado a ese registro.
        """
        registro_parqueo_id = request.data.get("registro_parqueo")
        if not registro_parqueo_id:
            return Response(
                {"error": "El ID del registro de parqueo es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            registro_parqueo = RegistroParqueo.objects.get(
                id=registro_parqueo_id)
        except RegistroParqueo.DoesNotExist:
            return Response(
                {"error": "El registro de parqueo no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if registro_parqueo.estado != "facturado":
            return Response(
                {"error": "El registro de parqueo no está en estado 'facturado'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crear el ticket asociado
        ticket_data = {
            "registro_parqueo": registro_parqueo.id,
            "total": registro_parqueo.total_cobro,
            "cliente": registro_parqueo.cliente,
            "estado": registro_parqueo.estado
        }
        serializer = self.get_serializer(data=ticket_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        """
        Al eliminar un ticket:
        - Cambia el estado a 'cancelado' en lugar de eliminarlo físicamente.
        """
        ticket = self.get_object()
        ticket.estado = "cancelado"
        ticket.save()
        return Response(
            {"detail": f"El ticket {ticket.numero_ticket} ha sido cancelado."},
            status=status.HTTP_200_OK,
        )
