from django.db import models
from django.conf import settings

class RecruiterProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recruiter_profile')
    company_name = models.CharField(max_length=200, blank=True, default='')
    company_description = models.TextField(blank=True, default='')
    company_website = models.URLField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hirehub_recruiter_profiles'
        verbose_name = 'Recruiter Profile'
        verbose_name_plural = 'Recruiter Profiles'

    def __str__(self):
        return f"Recruiter: {self.user.full_name} ({self.company_name or 'Independent'})"
