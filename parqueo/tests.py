from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
from django.db import transaction
from rest_framework.test import APITestCase
from rest_framework import status
from parqueo.models import RegistroParqueo
from tarifas.models import Tarifa
from core.models import TipoVehiculo
from decimal import Decimal


class RegistroParqueoTests(APITestCase):
    """Pruebas unitarias para la API de RegistroParqueo"""

    def setUp(self):
        """Configura los datos de prueba antes de cada test"""
        self.admin = User.objects.create_superuser(
            username="admin", password="admin123"
        )
        self.operario = User.objects.create_user(
            username="operario", password="operario123"
        )

        self.tipo_vehiculo = TipoVehiculo.objects.create(nombre="Automóvil")
        self.tarifa = Tarifa.objects.create(
            tipo_vehiculo=self.tipo_vehiculo, costo_por_minuto=Decimal("2.0")
        )

        self.registro = RegistroParqueo.objects.create(
            placa="AAA000",
            tipo=self.tipo_vehiculo,
            usuario_registra=self.admin,
        )

        self.endpoint = "/api/parqueo/registro-parqueo/"

    def test_crear_registro(self):
        """Prueba la creación de un registro de parqueo"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.endpoint, {
            "placa": "BBB111",
            "tipo": self.tipo_vehiculo.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_validacion_formato_placa(self):
        """Prueba que solo acepte placas sin guion (AAA000)"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.endpoint, {
            "placa": "CCC-222",  # Placa con guion, debería fallar
            "tipo": self.tipo_vehiculo.id
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_calculo_total_cobro(self):
        """Prueba que el cálculo del total cobrado sea correcto"""
        self.registro.fecha_salida = now()
        self.registro.save()

        # Calcular duración en minutos
        duracion_minutos = (self.registro.fecha_salida -
                            self.registro.fecha_entrada).total_seconds() / 60
        total_esperado = round(Decimal(duracion_minutos) *
                               self.tarifa.costo_por_minuto, 2)

        self.assertEqual(self.registro.calcular_total_cobro(), total_esperado)

    def test_api_listar_registros(self):
        """Prueba que cualquier usuario autenticado pueda listar registros"""
        self.client.force_authenticate(user=self.operario)
        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_editar_registro_admin(self):
        """Prueba que solo un admin pueda modificar un registro"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"{self.endpoint}{self.registro.id}/",
            {"placa": "ZZZ999"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.registro.refresh_from_db()
        self.assertEqual(self.registro.placa, "ZZZ999")

    def test_api_rechaza_modificacion_operario(self):
        """Prueba que un operario NO pueda modificar registros"""
        self.client.force_authenticate(user=self.operario)
        response = self.client.patch(
            f"{self.endpoint}{self.registro.id}/",
            {"placa": "ZZZ999"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_api_marcar_baja_admin(self):
        """Prueba que solo un admin pueda marcar un registro como eliminado"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"{self.endpoint}{self.registro.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.registro.refresh_from_db()
        self.assertEqual(self.registro.estado, "baja")
