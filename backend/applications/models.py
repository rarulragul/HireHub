import os
import uuid
from django.db import models
from jobs.models import Job
from candidates.models import CandidateProfile
from common.validators import validate_resume_file

def application_resume_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    safe_name = f"app_{instance.job_id}_{instance.candidate_id}_{uuid.uuid4().hex[:8]}{ext}"
    return os.path.join('resumes', 'applications', safe_name)

class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEW', 'Interview Scheduled'),
        ('SELECTED', 'Selected'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
    )

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name='applications')
    resume_path = models.FileField(upload_to=application_resume_path, blank=True, null=True, validators=[validate_resume_file])
    cover_letter = models.TextField(blank=True, default='')
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='APPLIED', db_index=True)
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hirehub_job_applications'
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
        ordering = ['-applied_at']
        # Database-level unique constraint to strictly prevent duplicate applications
        constraints = [
            models.UniqueConstraint(fields=['job', 'candidate'], name='unique_job_candidate_application')
        ]

    def __str__(self):
        return f"{self.candidate.user.full_name} -> {self.job.title} [{self.status}]"
