from django.urls import path
from .views import (
    JobListCreateView,
    JobDetailView,
    RecruiterJobsListView,
    AdminJobsListView
)

urlpatterns = [
    path('jobs/', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/my/', RecruiterJobsListView.as_view(), name='recruiter-jobs-my'),
    path('jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('admin/jobs/', AdminJobsListView.as_view(), name='admin-jobs-list'),
]
