from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('candidates.urls')),
    path('api/', include('recruiters.urls')),
    path('api/', include('jobs.urls')),
    path('api/', include('applications.urls')),
    path('api/', include('dashboard.urls')),
]

# Serve media files in development (DEBUG=True).
# In production on Render, serve media from the configured MEDIA_ROOT.
# Note: For persistent file storage on Render, add a Disk and set MEDIA_ROOT to its mount path.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Allow media serving in production as well (useful before adding a CDN/persistent disk)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
