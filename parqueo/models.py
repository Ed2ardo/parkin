from django.db import models
from decimal import Decimal
from django.utils.timezone import now
from django.contrib.auth.models import User
from tarifas.models import Tarifa


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

    def calcular_total_cobro(self):
        """Calcula el total a cobrar por minuto, en función del tiempo y la tarifa"""
        if not self.fecha_entrada:
            return Decimal(0)

        # if not self.fecha_salida:
        #     fecha_final = now()
        # else:
        #     fecha_final = self.fecha_salida

        fecha_final = self.fecha_salida or now()

        # Calcular duración en minutos
        duracion = (fecha_final - self.fecha_entrada).total_seconds()/60

        # obtener la tarifa asociada al tipo de vehículo
        tarifa = Tarifa.objects.filter(
            tipo_vehiculo=self.vehiculo.tipo).first()

        if tarifa:
            return round(tarifa.costo_por_minuto * Decimal(duracion), 2)
        return Decimal(0)  # Si no hay tarifa definida, devuelve 0

    def save(self, *args, **kwargs):
        # Calcula el total_cobro automáticamente antes de guardar
        if self.fecha_salida:  # Calcula si hay fecha de salida
            self.total_cobro = self.calcular_total_cobro()

        # Actualizar el estado a "facturado" automáticamente si se calculó el cobro
            if self.total_cobro and self.estado != "facturado":
                self.estado = "facturado"

        if not self.usuario_registra:
            self.usuario_registra = User.objects.filter(
                is_superuser=True).first()

        # guardar en la bbdd los cambios
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Registro {self.vehiculo.placa} - Entrada: {self.fecha_entrada}"

    class Meta:
        verbose_name = "Registro de Parqueo"
        verbose_name_plural = "Registros de Parqueo"
