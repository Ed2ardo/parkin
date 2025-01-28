# Generated by Django 5.1.4 on 2025-01-28 14:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
        ('tarifas', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tarifa',
            name='tipo_vehiculo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tipovehiculo', verbose_name='Tipo de Vehículo'),
        ),
    ]
