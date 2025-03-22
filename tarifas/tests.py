from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from core.models import TipoVehiculo
from tarifas.models import Tarifa
from django.core.exceptions import ValidationError



class TarifaTests(TestCase):
    """Pruebas para el modelo Tarifa y su API"""

    def setUp(self):
        """Se ejecuta antes de cada test"""
        self.admin_user = User.objects.create_superuser(
            username="admin", password="admin123"
        )
        self.operario_user = User.objects.create_user(
            username="operario", password="operario123"
        )
        self.tipo_vehiculo = TipoVehiculo.objects.create(nombre="Motocicleta")
        self.tarifa = Tarifa.objects.create(
            tipo_vehiculo=self.tipo_vehiculo, costo_por_minuto=0.5
        )

        self.client = APIClient()

    def test_crear_tarifa(self):
        """Prueba la creación de una Tarifa"""
        tarifa = Tarifa.objects.create(
            tipo_vehiculo=self.tipo_vehiculo, costo_por_minuto=1.01)
        self.assertEqual(str(tarifa), "Motocicleta - $1.01 por minuto")
            
    def test_validacion_costo_negativo(self):
        """Prueba que no se puedan crear tarifas con costo negativo"""
        tarifa = Tarifa(tipo_vehiculo=self.tipo_vehiculo, costo_por_minuto=-5)

        with self.assertRaises(ValidationError):  
            tarifa.full_clean()  # Valida manualmente antes de guardar

    def test_api_listar_tarifas(self):
        """Prueba que cualquier usuario autenticado pueda listar tarifas"""
        self.client.force_authenticate(user=self.operario_user)
        response = self.client.get("/api/tarifas/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Al menos 1 tarifa creada
        self.assertGreaterEqual(len(response.data), 1)

    def test_api_crear_tarifa_admin(self):
        """Prueba que solo un admin pueda crear tarifas"""
        self.client.force_authenticate(user=self.admin_user)
#        data = {"tipo_vehiculo": {"id": self.tipo_vehiculo.id}, "costo_por_minuto": 1.50}
        data = {"tipo_vehiculo": self.tipo_vehiculo.id, "costo_por_minuto": 1.50}
        response = self.client.post("/api/tarifas/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tarifa.objects.count(), 2)

    def test_api_editar_tarifa_admin(self):
        """Prueba que solo un admin pueda editar tarifas"""
        self.client.force_authenticate(user=self.admin_user)
        data = {"costo_por_minuto": 2.0}
        response = self.client.patch(f"/api/tarifas/{self.tarifa.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.tarifa.refresh_from_db()
        self.assertEqual(self.tarifa.costo_por_minuto, 2.0)

    def test_api_borrar_tarifa_admin(self):
        """Prueba que solo un admin pueda eliminar tarifas"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f"/api/tarifas/{self.tarifa.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tarifa.objects.count(), 0)

    def test_api_rechaza_modificacion_operario(self):
        """Prueba que un operario NO pueda modificar tarifas"""
        self.client.force_authenticate(user=self.operario_user)
        data = {"costo_por_minuto": 3.0}
        response = self.client.patch(f"/api/tarifas/{self.tarifa.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
