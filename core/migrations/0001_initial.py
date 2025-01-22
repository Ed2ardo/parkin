# Generated by Django 5.1.5 on 2025-01-22 13:22

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TipoVehiculo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20, unique=True, verbose_name='Tipo de Vehículo')),
            ],
            options={
                'verbose_name': 'Tipo de Vehículo',
                'verbose_name_plural': 'Tipos de Vehículos',
            },
        ),
        migrations.CreateModel(
            name='EspacioParqueoConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_espacios', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)], verbose_name='Total de Espacios')),
                ('tipo_espacio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configuraciones', to='core.tipovehiculo', verbose_name='Tipo de Espacio')),
            ],
            options={
                'verbose_name': 'Configuración de Espacio de Parqueo',
                'verbose_name_plural': 'Configuraciones de Espacios de Parqueo',
            },
        ),
    ]
