from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import TipoVehiculo, EspacioParqueoConfig


class TipoVehiculoTests(TestCase):
    """Pruebas para el modelo TipoVehiculo y su API"""

    def setUp(self):
        """Se ejecuta antes de cada test"""
        self.admin_user = User.objects.create_superuser(
            username="admin", password="admin123"
        )
        self.operario_user = User.objects.create_user(
            username="operario", password="operario123"
        )
        self.tipo_auto = TipoVehiculo.objects.create(nombre="Auto")

        self.client = APIClient()

    def test_crear_tipo_vehiculo(self):
        """Prueba la creación de un TipoVehiculo"""
        tipo_moto = TipoVehiculo.objects.create(nombre="Moto")
        self.assertEqual(str(tipo_moto), "Moto")

    def test_api_listar_tipos_vehiculos(self):
        """Prueba que un usuario autenticado pueda listar los tipos de vehículos"""
        self.client.force_authenticate(user=self.operario_user)
        response = self.client.get("/api/core/tipos-vehiculos/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["nombre"], "Auto")

    def test_api_crear_tipo_vehiculo_admin(self):
        """Prueba que solo el admin pueda crear un TipoVehiculo"""
        self.client.force_authenticate(user=self.admin_user)
        data = {"nombre": "Camión"}
        response = self.client.post("/api/core/tipos-vehiculos/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TipoVehiculo.objects.count(),
                         2)  # Se creó un nuevo tipo

    def test_api_crear_tipo_vehiculo_rechazado(self):
        """Prueba que un usuario normal NO pueda crear un TipoVehiculo"""
        self.client.force_authenticate(user=self.operario_user)
        data = {"nombre": "Camión"}
        response = self.client.post("/api/core/tipos-vehiculos/", data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_api_editar_tipo_vehiculo_admin(self):
        """Prueba que solo el admin pueda editar un TipoVehiculo"""
        self.client.force_authenticate(user=self.admin_user)
        data = {"nombre": "Automóvil"}
        response = self.client.patch(
            f"/api/core/tipos-vehiculos/{self.tipo_auto.id}/", data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tipo_auto.refresh_from_db()
        self.assertEqual(self.tipo_auto.nombre, "Automóvil")

    def test_api_eliminar_tipo_vehiculo_admin(self):
        """Prueba que solo el admin pueda eliminar un TipoVehiculo"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(
            f"/api/core/tipos-vehiculos/{self.tipo_auto.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TipoVehiculo.objects.count(), 0)

    def test_api_eliminar_tipo_vehiculo_rechazado(self):
        """Prueba que un usuario normal NO pueda eliminar un TipoVehiculo"""
        self.client.force_authenticate(user=self.operario_user)
        response = self.client.delete(
            f"/api/core/tipos-vehiculos/{self.tipo_auto.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

