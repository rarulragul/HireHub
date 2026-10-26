from django.urls import path
from .views import (
    CandidateDashboardView,
    RecruiterDashboardView,
    AdminDashboardView
)

urlpatterns = [
    path('dashboard/candidate/', CandidateDashboardView.as_view(), name='dashboard-candidate'),
    path('dashboard/recruiter/', RecruiterDashboardView.as_view(), name='dashboard-recruiter'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='dashboard-admin'),
    path('admin/analytics/', AdminDashboardView.as_view(), name='dashboard-analytics'),
]
