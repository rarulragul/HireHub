from django.urls import path
from .views import RecruiterMeView, RecruiterDetailView

urlpatterns = [
    path('recruiters/me/', RecruiterMeView.as_view(), name='recruiter-me'),
    path('recruiters/<int:pk>/', RecruiterDetailView.as_view(), name='recruiter-detail'),
]
