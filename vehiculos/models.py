from django.db import models
from django.core.validators import RegexValidator
# from core.models import TipoVehiculo


# Representa los vehículos registrados.
class Vehiculo(models.Model):
    placa = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True,
        validators=[RegexValidator(
            regex='^[A-Z0-9-]{6,10}$',
            message='Formato de placa inválido (solo mayúsculas, números y guiones).'
        )],
        verbose_name="Placa del Vehículo"
    )
    tipo = models.ForeignKey(
        'core.TipoVehiculo', on_delete=models.CASCADE, related_name="vehiculos", verbose_name="Tipo de Vehículo"
    )
    # cliente = models.ForeignKey(
    #     'clientes.Cliente', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Cliente Asociado"
    # )
    cliente = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Cliente Asociado")

    def __str__(self):
        return f"{self.tipo.nombre} - {self.placa if self.placa else 'Sin Placa'}"

    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
