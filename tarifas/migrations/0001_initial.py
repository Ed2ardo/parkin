# Generated by Django 5.1.4 on 2025-02-11 12:41

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tarifa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('costo_por_minuto', models.DecimalField(decimal_places=2, max_digits=6, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Costo por Minuto')),
                ('tipo_vehiculo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tipovehiculo', verbose_name='Tipo de Vehículo')),
            ],
            options={
                'verbose_name': 'Tarifa',
                'verbose_name_plural': 'Tarifas',
            },
        ),
    ]
