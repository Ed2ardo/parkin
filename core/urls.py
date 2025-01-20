from rest_framework.routers import DefaultRouter
from .views import TipoVehiculoViewSet, EspacioParqueoConfigViewSet


router = DefaultRouter()
router.register(r'tipos-vehiculos', TipoVehiculoViewSet,
                basename='tipo-vehiculos')
router.register(r'espacios-parqueo', EspacioParqueoConfigViewSet,
                basename='espacios-parqueo')


urlpatterns = router.urls
