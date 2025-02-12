# Generated by Django 5.1.4 on 2025-02-11 12:41

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0001_initial'),
        ('tickets', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='RegistroParqueo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('placa', models.CharField(max_length=10, validators=[django.core.validators.RegexValidator(message='Formato de placa inválido (solo mayúsculas, números y guiones).', regex='^[A-Z0-9-]{6,10}$')], verbose_name='Placa del Vehículo')),
                ('fecha_entrada', models.DateTimeField(auto_now_add=True, verbose_name='Fecha y Hora de Entrada')),
                ('fecha_salida', models.DateTimeField(blank=True, null=True, verbose_name='Fecha y Hora de Salida')),
                ('total_cobro', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Total Cobrado')),
                ('estado', models.CharField(choices=[('activo', 'Activo'), ('baja', 'Eliminado'), ('facturado', 'Facturado')], default='activo', max_length=20, verbose_name='Estado del Registro')),
                ('cliente', models.CharField(blank=True, max_length=100, null=True, verbose_name='Cliente Asociado')),
                ('ticket', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='tickets.ticket', verbose_name='Ticket Asociado')),
                ('tipo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.tipovehiculo', verbose_name='Tipo de Vehículo')),
                ('usuario_registra', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Usuario que Registró')),
            ],
            options={
                'verbose_name': 'Registro de Parqueo',
                'verbose_name_plural': 'Registros de Parqueo',
                'indexes': [models.Index(fields=['placa'], name='parqueo_reg_placa_7ec59b_idx'), models.Index(fields=['fecha_entrada'], name='parqueo_reg_fecha_e_82e62a_idx')],
            },
        ),
    ]
