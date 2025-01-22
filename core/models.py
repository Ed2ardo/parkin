from django.core.validators import MinValueValidator
from django.db import models
from parqueo.models import RegistroParqueo

# configuracion de tipo vehiculos y espacios totales


class TipoVehiculo(models.Model):
    nombre = models.CharField(
        max_length=20, unique=True, verbose_name="Tipo de Vehículo")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Tipo de Vehículo"
        verbose_name_plural = "Tipos de Vehículos"


# Configura la cantidad de espacios por tipo de vehículo y su ocupación.
class EspacioParqueoConfig(models.Model):
    tipo_espacio = models.ForeignKey(
        TipoVehiculo, on_delete=models.CASCADE, related_name="configuraciones", verbose_name="Tipo de Espacio"
    )
    total_espacios = models.PositiveIntegerField(
        validators=[MinValueValidator(1)], verbose_name="Total de Espacios"
    )

    @property
    def espacios_ocupados(self):
        # Calcula los espacios ocupados a partir de registros activos
        return RegistroParqueo.objects.filter(
            tipo=self.tipo_espacio,
            estado="activo"
        ).count()

    @property
    def espacios_disponibles(self):
        # Calcula los espacios disponibles en función del total y los ocupados
        return self.total_espacios - self.espacios_ocupados

    def __str__(self):
        return f"{self.tipo_espacio.nombre} - Total: {self.total_espacios}"

    class Meta:
        verbose_name = "Configuración de Espacio de Parqueo"
        verbose_name_plural = "Configuraciones de Espacios de Parqueo"
