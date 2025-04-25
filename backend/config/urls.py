from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/discussions/', include('apps.discussions.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
