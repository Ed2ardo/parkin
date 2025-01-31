from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from .auth_views import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/parqueo/', include('parqueo.urls')),
    path('api/tarifas/', include('tarifas.urls')),
    path('api/tickets/', include('tickets.urls')),

    # 📌 Login y Refresh Token
    path("api/token/", CustomTokenObtainPairView.as_view(),
         name="token_obtain_pair"),
    path("api/token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
]
