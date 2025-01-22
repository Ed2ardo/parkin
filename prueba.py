# Usar el Shell interactivo de Django

# python manage.py shell


from parqueo.models import RegistroParqueo
from parqueo.serializers import RegistroParqueoSerializers
from django.contrib.auth.models import User
from core.models import TipoVehiculo
from django.utils.timezone import now

# Crear Registro:
# Obteniendo un tipo de vehículo
tipo = TipoVehiculo.objects.filter(nombre="Carro").first()
if not tipo:
    raise ValueError("No existe un tipo de vehículo llamado 'Carro'")

user = User.objects.first()          # Obteniendo un usuario

registro = RegistroParqueo.objects.create(
    placa="ABC123",
    tipo=tipo,
    usuario_registra=user,
    cliente="Juan Pérez"
)
print(registro)


# Obtener un registro existente:
# registro = RegistroParqueo.objects.first()
# O buscar un registro específico:
# registro = RegistroParqueo.objects.get(id=1)


# llamar al método calcular_cobro:
total_cobro = registro.calcular_total_cobro()
print(f"El total calculado para el registro es: {total_cobro}")
# Esto ejecutará la lógica definida en el método y calculará el total a cobrar según la fecha de entrada, la fecha de salida, y la tarifa asociada al tipo de vehículo.


# Con datos interactivos
registro.fecha_salida = now()  # Usa la hora actual como fecha de salida
total_cobro = registro.calcular_total_cobro()
print(f"El total calculado con fecha de salida actual es: {total_cobro}")


# Guardar cambios, opcional:
registro.fecha_salida = now()  # Asignar fecha de salida
registro.save()  # Esto calculará automáticamente el total y lo guardará
print(f"Registro actualizado: {registro.total_cobro}")


# Seralizar un registro:

serializer = RegistroParqueoSerializers(registro)
print(serializer.data)


# Validar datos para crear un registro:
data = {
    "placa": "XYZ789",
    "tipo": tipo.id,
    "cliente": "Ana Gómez"
}
serializer = RegistroParqueoSerializers(data=data)
if serializer.is_valid():
    serializer.save()
else:
    print(serializer.errors)


# Ejemplo completo:
>> > from parqueo.models import RegistroParqueo
>> > from django.utils.timezone import now

# Obtén el primer registro
>> > registro = RegistroParqueo.objects.first()

# Llama al método calcular_total_cobro
>> > total_cobro = registro.calcular_total_cobro()
>> > print(f"Total cobrado: {total_cobro}")

# Simula una fecha de salida y recalcula
>> > registro.fecha_salida = now()
>> > total_cobro_simulado = registro.calcular_total_cobro()
>> > print(f"Total con fecha de salida actual: {total_cobro_simulado}")

# Guarda los cambios
>> > registro.save()
>> > print(f"Registro actualizado: {registro.total_cobro}")
