from django.db import models
from recruiters.models import RecruiterProfile

class Job(models.Model):
    EMPLOYMENT_CHOICES = (
        ('FULL_TIME', 'Full Time'),
        ('PART_TIME', 'Part Time'),
        ('CONTRACT', 'Contract'),
        ('INTERNSHIP', 'Internship'),
        ('REMOTE', 'Remote'),
    )

    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('OPEN', 'Open'),
        ('CLOSED', 'Closed'),
    )

    title = models.CharField(max_length=200, db_index=True)
    description = models.TextField()
    required_skills = models.TextField(help_text="Comma-separated skills required")
    department = models.CharField(max_length=100, db_index=True)
    location = models.CharField(max_length=150, db_index=True)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_CHOICES, default='FULL_TIME')
    experience_required = models.DecimalField(max_digits=4, decimal_places=1, default=0.0)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN', db_index=True)
    recruiter = models.ForeignKey(RecruiterProfile, on_delete=models.CASCADE, related_name='jobs')
    application_deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hirehub_jobs'
        verbose_name = 'Job'
        verbose_name_plural = 'Jobs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.department} ({self.status})"
