from django.db import models
from decimal import Decimal
from django.contrib.auth.models import User


# Gestiona los registros de entrada y salida de los vehículos.


class RegistroParqueo(models.Model):
    vehiculo = models.ForeignKey(
        'vehiculos.Vehiculo', on_delete=models.CASCADE, related_name="registros_parqueo", verbose_name="Vehículo Asociado"
    )
    usuario_registra = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Usuario que Registró"
    )
    fecha_entrada = models.DateTimeField(
        auto_now_add=True, verbose_name="Fecha y Hora de Entrada")
    fecha_salida = models.DateTimeField(
        null=True, blank=True, verbose_name="Fecha y Hora de Salida")
    total_cobro = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Total Cobrado"
    )
    estado = models.CharField(
        max_length=20,
        choices=[("activo", "Activo"), ("baja", "Baja"),
                 ("facturado", "Facturado")],
        default="activo",
        verbose_name="Estado del Registro"
    )

    def save(self, *args, **kwargs):
        if not self.usuario_registra:
            self.usuario_registra = User.objects.filter(
                is_superuser=True).first()
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Registro {self.vehiculo.placa} - Entrada: {self.fecha_entrada}"

    class Meta:
        verbose_name = "Registro de Parqueo"
        verbose_name_plural = "Registros de Parqueo"
