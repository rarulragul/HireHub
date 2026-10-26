from django.urls import path
from .views import (
    JobApplyView,
    CandidateApplicationsListView,
    RecruiterJobApplicationsListView,
    ApplicationDetailView,
    ApplicationStatusUpdateView,
    ApplicationWithdrawView,
    AdminApplicationsListView,
    ApplicationResumeDownloadView
)

urlpatterns = [
    # Apply to a job
    path('jobs/<int:job_id>/applications/', JobApplyView.as_view(), name='job-apply'),
    
    # Recruiter view applicants for a job
    path('jobs/<int:job_id>/applicants/', RecruiterJobApplicationsListView.as_view(), name='job-applicants'),
    
    # Candidate view their own applications
    path('applications/my/', CandidateApplicationsListView.as_view(), name='applications-my'),
    
    # Single application operations
    path('applications/<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('applications/<int:pk>/status/', ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('applications/<int:pk>/withdraw/', ApplicationWithdrawView.as_view(), name='application-withdraw'),
    path('applications/<int:pk>/resume/', ApplicationResumeDownloadView.as_view(), name='application-resume-download'),
    
    # Admin all applications
    path('admin/applications/', AdminApplicationsListView.as_view(), name='admin-applications-list'),
]
