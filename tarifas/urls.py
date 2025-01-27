from rest_framework.routers import DefaultRouter
from .views import TarifaViewSet

router = DefaultRouter()
router.register(r'', TarifaViewSet)

urlpatterns = router.urls
