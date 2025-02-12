# Generated by Django 5.1.4 on 2025-02-11 12:41

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_ticket', models.CharField(max_length=10, unique=True, verbose_name='Número de Ticket')),
                ('total', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Total Cobrado')),
                ('fecha_emision', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Fecha de Emisión')),
                ('cliente', models.CharField(blank=True, max_length=100, null=True, verbose_name='Cliente Asociado')),
                ('notas_legales', models.TextField(blank=True, null=True, verbose_name='Notas Legales o Información Adicional')),
                ('estado', models.CharField(choices=[('activo', 'Activo'), ('cancelado', 'Cancelado')], default='activo', max_length=20, verbose_name='Estado del Ticket')),
            ],
            options={
                'verbose_name': 'Ticket',
                'verbose_name_plural': 'Tickets',
                'indexes': [models.Index(fields=['numero_ticket'], name='tickets_tic_numero__84ef8e_idx'), models.Index(fields=['fecha_emision'], name='tickets_tic_fecha_e_0a5dd3_idx')],
            },
        ),
    ]
