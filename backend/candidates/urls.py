from django.urls import path
from .views import (
    CandidateMeView,
    CandidateResumeUploadView,
    CandidateResumeDownloadView
)

urlpatterns = [
    path('candidates/me/', CandidateMeView.as_view(), name='candidate-me'),
    path('candidates/me/resume/', CandidateResumeUploadView.as_view(), name='candidate-resume-upload'),
    path('candidates/resume/', CandidateResumeDownloadView.as_view(), name='candidate-resume-download-me'),
    path('candidates/<int:pk>/resume/', CandidateResumeDownloadView.as_view(), name='candidate-resume-download-pk'),
]
