import os
import uuid
from django.db import models
from django.conf import settings
from common.validators import validate_resume_file

def candidate_resume_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    safe_name = f"candidate_{instance.user_id}_{uuid.uuid4().hex[:10]}{ext}"
    return os.path.join('resumes', safe_name)

class CandidateProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='candidate_profile')
    phone = models.CharField(max_length=25, blank=True, default='')
    location = models.CharField(max_length=150, blank=True, default='')
    education = models.CharField(max_length=255, blank=True, default='')
    experience_years = models.DecimalField(max_digits=4, decimal_places=1, default=0.0)
    skills = models.TextField(blank=True, default='', help_text="Comma-separated skills list")
    resume_path = models.FileField(upload_to=candidate_resume_path, blank=True, null=True, validators=[validate_resume_file])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hirehub_candidate_profiles'
        verbose_name = 'Candidate Profile'
        verbose_name_plural = 'Candidate Profiles'

    def __str__(self):
        return f"Candidate: {self.user.full_name} ({self.location})"
