from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Ticket
from parqueo.models import RegistroParqueo
from core.models import TipoVehiculo


class TicketTests(TestCase):
    """Pruebas unitarias para la gestión de Tickets."""

    def setUp(self):
        """Configuración inicial antes de cada prueba."""
        # Crear un usuario administrador
        self.admin_user = User.objects.create_superuser(
            username="admin", password="admin123"
        )

        # Crear un usuario normal
        self.normal_user = User.objects.create_user(
            username="user", password="user123"
        )

        # Crear un tipo de vehículo válido antes de usarlo en RegistroParqueo
        self.tipo_vehiculo = TipoVehiculo.objects.create(
            nombre="Carro",
        )

        # Crear un registro de parqueo NO facturado
        self.registro_no_facturado = RegistroParqueo.objects.create(
            tipo=self.tipo_vehiculo,
            estado="activo",
            total_cobro=3000
        )

        # Crear un registro de parqueo en estado "facturado"
        self.registro_facturado = RegistroParqueo.objects.create(
            tipo=self.tipo_vehiculo,
            estado="facturado",
            total_cobro=5000,
            cliente="Juan Pérez"
        )

        # Cliente API para pruebas autenticadas
        self.client = APIClient()
        self.tickets_url = "/api/tickets/"

    def test_crear_ticket_exitoso(self):
        """Verifica que un ticket se genera automáticamente cuando el registro de parqueo es facturado."""
        # El ticket debería haberse creado automáticamente
        self.registro_facturado.refresh_from_db()
        ticket_generado = self.registro_facturado.ticket

        self.assertIsNotNone(ticket_generado)
        self.assertEqual(ticket_generado.total,
                         self.registro_facturado.total_cobro)

    def test_error_crear_ticket_sin_registro_parqueo(self):
        """Verifica que no se puede crear un ticket sin especificar un registro de parqueo."""
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post(self.tickets_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_error_crear_ticket_registro_no_facturado(self):
        """Verifica que no se puede crear un ticket si el registro de parqueo no está en estado 'facturado'."""
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post(self.tickets_url, {
            "registro_parqueo": self.registro_no_facturado.id
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancelar_ticket(self):
        """Verifica que al cancelar un ticket, su estado cambia a 'cancelado' en lugar de eliminarlo."""
        ticket = Ticket.objects.create(
            numero_ticket="00001",
            total=5000,
            cliente="Juan Pérez",
        )
        self.client.force_authenticate(
            user=self.admin_user)  # Solo admin puede cancelar
        response = self.client.delete(f"{self.tickets_url}{ticket.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ticket.refresh_from_db()
        self.assertEqual(ticket.estado, "cancelado")

    def test_autogeneracion_numero_ticket(self):
        """Verifica que el número de ticket se genera automáticamente si no se especifica."""
        ticket = Ticket.objects.create(total=7000)
        self.assertIsNotNone(ticket.numero_ticket)
