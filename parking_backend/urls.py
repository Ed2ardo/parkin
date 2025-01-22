from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/parqueo/', include('parqueo.urls')),
    path('api/tarifas/', include('tarifas.urls')),
]
