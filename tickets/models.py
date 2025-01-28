from django.db import models
from django.utils.timezone import now
from parqueo.models import RegistroParqueo


class Ticket(models.Model):
    registro_parqueo = models.OneToOneField(
        RegistroParqueo,
        on_delete=models.CASCADE,
        verbose_name="Registro de Parqueo Asociado"
    )
    numero_ticket = models.CharField(
        max_length=10,
        unique=True,
        verbose_name="Número de Ticket"
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Total Cobrado"
    )
    fecha_emision = models.DateTimeField(
        default=now,
        verbose_name="Fecha de Emisión"
    )
    cliente = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Cliente Asociado"
    )
    notas_legales = models.TextField(
        null=True,
        blank=True,
        verbose_name="Notas Legales o Información Adicional"
    )
    estado = models.CharField(
        max_length=20,
        choices=[
            ("activo", "Activo"),
            ("cancelado", "Cancelado"),
        ],
        default="activo",
        verbose_name="Estado del Ticket"
    )

    def save(self, *args, **kwargs):
        """
        Antes de guardar, establece automáticamente:
        - El número de ticket si no existe.
        - El total desde el registro asociado si no se especifica.
        """
        if not self.numero_ticket:
            # Generar un número de ticket único y secuencial
            ultimo_ticket = Ticket.objects.aggregate(
                models.Max('id')).get('id__max') or 0
            # Formato 00001, 00002, etc.
            self.numero_ticket = f"{ultimo_ticket + 1:05d}"

        if not self.total and self.registro_parqueo:
            self.total = self.registro_parqueo.total_cobro

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Ticket #{self.numero_ticket} - Registro: {self.registro_parqueo.placa}"

    class Meta:
        verbose_name = "Ticket"
        verbose_name_plural = "Tickets"
        indexes = [
            models.Index(fields=["numero_ticket"]),
            models.Index(fields=["fecha_emision"]),
        ]
