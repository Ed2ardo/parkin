from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.test import TestCase
from core.models import Tarifa


class TarifaModelTest(TestCase):
    def setUp(self):
        self.tarifa = Tarifa.objects.create(
            tipo_vehiculo="Carro", costo_por_minuto=0.05)

    def test_tarifa_creacion(self):
        self.assertEqual(self.tarifa.tipo_vehiculo, "Carro")
        self.assertEqual(self.tarifa.costo_por_minuto, 0.05)


class TarifaViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tarifa = Tarifa.objects.create(
            tipo_vehiculo="Moto", costo_por_minuto=0.02)

    def test_obtener_tarifas(self):
        url = reverse('tarifa-list')  # Usa el nombre de la URL en `urls.py`
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


def test_requiere_autenticacion(self):
    url = reverse('tarifa-list')
    response = self.client.get(url)
    # Debería requerir autenticación
    self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
