from rest_framework.routers import DefaultRouter
from .views import TicketViewSet

router = DefaultRouter()
router.register(r'', TicketViewSet)

urlpatterns = router.urls
