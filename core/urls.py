from rest_framework.routers import DefaultRouter
from .views import TipoVehiculoViewSet, EspacioParqueoConfigViewSet
from .views import get_current_user
from django.urls import path


router = DefaultRouter()
router.register(r'tipos-vehiculos', TipoVehiculoViewSet,
                basename='tipo-vehiculos')
router.register(r'espacios-parqueo', EspacioParqueoConfigViewSet,
                basename='espacios-parqueo')


urlpatterns = router.urls + [
    path("me/", get_current_user, name="current_user"),
]
