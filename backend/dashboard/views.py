from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from accounts.models import User
from jobs.models import Job
from applications.models import JobApplication
from candidates.models import CandidateProfile
from recruiters.models import RecruiterProfile
from common.permissions import IsAdminUserRole, IsRecruiterUserRole, IsCandidateUserRole

class CandidateDashboardView(views.APIView):
    permission_classes = [IsCandidateUserRole]

    def get(self, request):
        candidate, _ = CandidateProfile.objects.get_or_create(user=request.user)
        apps = JobApplication.objects.filter(candidate=candidate)

        total_applications = apps.count()
        under_review = apps.filter(status__in=['APPLIED', 'UNDER_REVIEW']).count()
        shortlisted = apps.filter(status='SHORTLISTED').count()
        interview = apps.filter(status='INTERVIEW').count()
        selected = apps.filter(status='SELECTED').count()
        rejected = apps.filter(status='REJECTED').count()
        withdrawn = apps.filter(status='WITHDRAWN').count()

        # Status breakdown for charts
        status_counts = apps.values('status').annotate(count=Count('id'))
        status_map = {item['status']: item['count'] for item in status_counts}

        # Recent 5 applications
        recent = apps.select_related('job__recruiter__user').order_by('-applied_at')[:5]
        recent_data = [
            {
                'id': app.id,
                'job_id': app.job.id,
                'job_title': app.job.title,
                'company_name': app.job.recruiter.company_name or 'Hiring Company',
                'location': app.job.location,
                'status': app.status,
                'applied_at': app.applied_at.isoformat()
            }
            for app in recent
        ]

        return Response({
            'total_applications': total_applications,
            'under_review': under_review,
            'shortlisted': shortlisted,
            'interview': interview,
            'selected': selected,
            'rejected': rejected,
            'withdrawn': withdrawn,
            'status_chart': [
                {'name': 'Under Review', 'value': under_review},
                {'name': 'Shortlisted', 'value': shortlisted},
                {'name': 'Interview', 'value': interview},
                {'name': 'Selected', 'value': selected},
                {'name': 'Rejected', 'value': rejected},
                {'name': 'Withdrawn', 'value': withdrawn},
            ],
            'recent_applications': recent_data
        })


class RecruiterDashboardView(views.APIView):
    permission_classes = [IsRecruiterUserRole]

    def get(self, request):
        recruiter, _ = RecruiterProfile.objects.get_or_create(user=request.user)
        jobs = Job.objects.filter(recruiter=recruiter)
        apps = JobApplication.objects.filter(job__recruiter=recruiter)

        total_jobs = jobs.count()
        active_jobs = jobs.filter(status='OPEN').count()
        closed_jobs = jobs.filter(status='CLOSED').count()
        total_applicants = apps.count()

        # Status distribution
        status_counts = apps.values('status').annotate(count=Count('id'))
        status_data = [
            {'status': item['status'], 'count': item['count']}
            for item in status_counts
        ]

        # Job-wise applicant counts (top 6 jobs)
        job_counts = jobs.annotate(applicants_count=Count('applications')).order_by('-applicants_count')[:6]
        job_chart = [
            {'job_title': job.title[:20], 'applicants': job.applicants_count}
            for job in job_counts
        ]

        # Recent 5 applications
        recent = apps.select_related('candidate__user', 'job').order_by('-applied_at')[:5]
        recent_data = [
            {
                'id': app.id,
                'job_id': app.job.id,
                'job_title': app.job.title,
                'candidate_name': app.candidate.user.full_name,
                'candidate_email': app.candidate.user.email,
                'status': app.status,
                'applied_at': app.applied_at.isoformat()
            }
            for app in recent
        ]

        return Response({
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'closed_jobs': closed_jobs,
            'total_applicants': total_applicants,
            'status_distribution': status_data,
            'job_chart': job_chart,
            'recent_applicants': recent_data
        })


class AdminDashboardView(views.APIView):
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_candidates = User.objects.filter(role='CANDIDATE').count()
        total_recruiters = User.objects.filter(role='RECRUITER').count()
        total_jobs = Job.objects.count()
        active_jobs = Job.objects.filter(status='OPEN').count()
        total_applications = JobApplication.objects.count()

        # Application status distribution
        status_counts = JobApplication.objects.values('status').annotate(count=Count('id'))
        status_chart = [
            {'name': item['status'], 'value': item['count']}
            for item in status_counts
        ]

        # Monthly recruitment application trends
        trends_qs = (
            JobApplication.objects
            .annotate(month=TruncMonth('applied_at'))
            .values('month')
            .annotate(applications=Count('id'))
            .order_by('month')[:6]
        )
        monthly_trends = [
            {
                'month': item['month'].strftime('%b %Y') if item['month'] else 'N/A',
                'applications': item['applications']
            }
            for item in trends_qs
        ]

        # Recent platform activity
        recent_users = User.objects.order_by('-date_joined')[:5]
        recent_users_data = [
            {
                'id': u.id,
                'name': u.full_name,
                'email': u.email,
                'role': u.role,
                'date_joined': u.date_joined.isoformat(),
                'is_active': u.is_active
            }
            for u in recent_users
        ]

        return Response({
            'total_candidates': total_candidates,
            'total_recruiters': total_recruiters,
            'total_jobs': total_jobs,
            'active_jobs': active_jobs,
            'total_applications': total_applications,
            'status_distribution': status_chart,
            'monthly_trends': monthly_trends,
            'recent_users': recent_users_data
        })
