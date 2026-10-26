from django.db.models import Q
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer, JobCreateUpdateSerializer
from recruiters.models import RecruiterProfile
from common.permissions import IsRecruiterUserRole, IsAdminUserRole, IsOwnerOrAdmin

class JobListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateUpdateSerializer
        return JobSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsRecruiterUserRole()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = Job.objects.select_related('recruiter__user').prefetch_related('applications').all()

        # Public / candidate queries default to OPEN jobs only
        is_staff_or_admin = self.request.user.is_authenticated and (
            self.request.user.role == 'ADMIN' or self.request.user.is_superuser
        )

        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        elif not is_staff_or_admin:
            qs = qs.filter(status='OPEN')

        # Filters
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(required_skills__icontains=search) |
                Q(recruiter__company_name__icontains=search)
            )

        department = self.request.query_params.get('department')
        if department:
            qs = qs.filter(department__icontains=department)

        location = self.request.query_params.get('location')
        if location:
            qs = qs.filter(location__icontains=location)

        employment_type = self.request.query_params.get('employment_type')
        if employment_type:
            qs = qs.filter(employment_type=employment_type)

        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        recruiter_profile, _ = RecruiterProfile.objects.get_or_create(user=self.request.user)
        serializer.save(recruiter=recruiter_profile)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.select_related('recruiter__user').all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobCreateUpdateSerializer
        return JobSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsOwnerOrAdmin()]


class RecruiterJobsListView(generics.ListAPIView):
    """List all jobs created by the authenticated recruiter."""
    permission_classes = [IsRecruiterUserRole]
    serializer_class = JobSerializer

    def get_queryset(self):
        profile, _ = RecruiterProfile.objects.get_or_create(user=self.request.user)
        return Job.objects.filter(recruiter=profile).order_by('-created_at')


class AdminJobsListView(generics.ListAPIView):
    """Admin view for all jobs across all recruiters."""
    permission_classes = [IsAdminUserRole]
    serializer_class = JobSerializer
    queryset = Job.objects.select_related('recruiter__user').order_by('-created_at')
