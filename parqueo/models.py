from django.db import models
from decimal import Decimal
from django.utils.timezone import now
from django.contrib.auth.models import User
from tarifas.models import Tarifa
from django.core.validators import RegexValidator


# Gestiona los registros de entrada y salida de los vehículos.


class RegistroParqueo(models.Model):

    placa = models.CharField(
        max_length=10,
        # null=True,
        # blank=True,
        validators=[RegexValidator(
            regex='^[A-Z0-9]{6,10}$',
            message='Formato de placa inválido (solo mayúsculas, números y guiones).'
        )],
        verbose_name="Placa del Vehículo"
    )

    ticket = models.OneToOneField(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Ticket Asociado"
    )

    tipo = models.ForeignKey(
        'core.TipoVehiculo', on_delete=models.CASCADE, verbose_name="Tipo de Vehículo", blank=True, null=True
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
        choices=[("activo", "Activo"), ("baja", "Eliminado"),
                 ("facturado", "Facturado")],
        default="activo",
        verbose_name="Estado del Registro"
    )

    # cliente = models.ForeignKey(
    #     'clientes.Cliente', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Cliente Asociado"
    # )
    cliente = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Cliente Asociado")

    def calcular_total_cobro(self):
        """Calcula el total a cobrar por minuto, en función del tiempo y la tarifa"""
        if not self.fecha_entrada:
            return Decimal(0)

        fecha_final = self.fecha_salida or now()

        # Calcular duración en minutos
        duracion = (fecha_final - self.fecha_entrada).total_seconds()/60

        # obtener la tarifa asociada al tipo de vehículo
        tarifa = Tarifa.objects.filter(
            tipo_vehiculo=self.tipo).first()

        if not tarifa:
            raise ValueError(
                f"No hay tarifa definida para el tipo de vehículo: {self.tipo}")

        if tarifa:
            return round(tarifa.costo_por_minuto * Decimal(duracion), 2)
        return Decimal(0)  # Si no hay tarifa definida, devuelve 0

    def save(self, *args, **kwargs):
        """Calcula el total_cobro automáticamente antes de guardar.
        Si el estado es "facturado" y no tiene fecha de salida, la registra:
        """
        if self.estado == "facturado" and not self.fecha_salida:
            self.fecha_salida = now()
            self.total_cobro = self.calcular_total_cobro()

        if not self.usuario_registra:
            self.usuario_registra = User.objects.filter(
                is_superuser=True).first()

        # guardar en la bbdd los cambios
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Registro {self.placa} - Entrada: {self.fecha_entrada}"

    class Meta:
        verbose_name = "Registro de Parqueo"
        verbose_name_plural = "Registros de Parqueo"
        indexes = [
            models.Index(fields=["placa"]),
            models.Index(fields=["fecha_entrada"]),
        ]
