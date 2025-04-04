from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLES = (
        ("admin", "Administrador"),
        ("operario", "Operario"),
    )
    rol = models.CharField(max_length=10, choices=ROLES, default="operario")
