from django.db import models
from django.core.validators import MinValueValidator
from core.models import TipoVehiculo

# tarifas/models.py


class Tarifa(models.Model):
    tipo_vehiculo = models.ForeignKey(
        'core.TipoVehiculo', on_delete=models.CASCADE, related_name="tarifas", verbose_name="Tipo de Vehículo"
    )
    costo_por_minuto = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        verbose_name="Costo por Minuto"
    )

    def __str__(self):
        return f"{self.tipo_vehiculo.nombre} - ${self.costo_por_minuto} por minuto"

    class Meta:
        verbose_name = "Tarifa"
        verbose_name_plural = "Tarifas"
