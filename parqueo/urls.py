from rest_framework.routers import DefaultRouter
from .views import RegistroParqueoViewSet

router = DefaultRouter()
router.register(r'registro-parqueo', RegistroParqueoViewSet,
                basename='registro-parqueo')

urlpatterns = router.urls
