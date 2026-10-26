import os
from django.http import FileResponse, Http404
from django.db import IntegrityError
from rest_framework import generics, status, views, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import JobApplication
from .serializers import (
    JobApplicationSerializer,
    JobApplicationCreateSerializer,
    ApplicationStatusUpdateSerializer
)
from jobs.models import Job
from candidates.models import CandidateProfile
from common.permissions import IsCandidateUserRole, IsRecruiterUserRole, IsAdminUserRole
from common.validators import validate_resume_file

class JobApplyView(views.APIView):
    permission_classes = [IsCandidateUserRole]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, job_id):
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        if job.status != 'OPEN':
            return Response({'error': 'This job is no longer accepting applications.'}, status=status.HTTP_400_BAD_REQUEST)

        candidate_profile, _ = CandidateProfile.objects.get_or_create(user=request.user)

        # Duplicate check
        if JobApplication.objects.filter(job=job, candidate=candidate_profile).exists():
            return Response({'error': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)

        cover_letter = request.data.get('cover_letter', '')
        custom_resume = request.FILES.get('resume_path') or request.FILES.get('resume')

        # Check if candidate has either uploaded a resume now or has one in their profile
        if custom_resume:
            try:
                validate_resume_file(custom_resume)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        elif not candidate_profile.resume_path or not candidate_profile.resume_path.name:
            return Response(
                {'error': 'A resume is required to apply. Please upload a resume with this application or add one to your profile.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            application = JobApplication.objects.create(
                job=job,
                candidate=candidate_profile,
                cover_letter=cover_letter,
                resume_path=custom_resume if custom_resume else candidate_profile.resume_path
            )
            return Response(JobApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({'error': 'You have already submitted an application for this job.'}, status=status.HTTP_400_BAD_REQUEST)


class CandidateApplicationsListView(generics.ListAPIView):
    """List all applications submitted by the current candidate."""
    permission_classes = [IsCandidateUserRole]
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        candidate_profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return JobApplication.objects.filter(candidate=candidate_profile).select_related(
            'job__recruiter__user', 'candidate__user'
        ).order_by('-applied_at')


class RecruiterJobApplicationsListView(generics.ListAPIView):
    """List all applicants for a specific job owned by the logged in recruiter."""
    permission_classes = [IsRecruiterUserRole]
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        user = self.request.user

        qs = JobApplication.objects.filter(job_id=job_id).select_related('candidate__user', 'job__recruiter__user')
        if user.role != 'ADMIN' and not user.is_superuser:
            qs = qs.filter(job__recruiter__user=user)

        # Status filter
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)

        return qs.order_by('-applied_at')


class ApplicationDetailView(generics.RetrieveAPIView):
    """Retrieve details for a specific application with authorization checks."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.select_related('candidate__user', 'job__recruiter__user').all()

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        # Allow Admin, application Candidate owner, or job Recruiter owner
        if user.role == 'ADMIN' or user.is_superuser:
            return obj
        if obj.candidate.user == user:
            return obj
        if obj.job.recruiter.user == user:
            return obj
        raise permissions.PermissionDenied("You do not have permission to view this application.")


class ApplicationStatusUpdateView(views.APIView):
    """Recruiter or Admin updates an application's review status."""
    permission_classes = [IsRecruiterUserRole]

    def patch(self, request, pk):
        try:
            application = JobApplication.objects.select_related('job__recruiter__user').get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Recruiter can only update their own job applications
        user = request.user
        if user.role != 'ADMIN' and not user.is_superuser:
            if application.job.recruiter.user != user:
                return Response({'error': 'You can only update applications for your own jobs.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': f"Application status updated to '{application.status}'.",
            'application': JobApplicationSerializer(application).data
        })


class ApplicationWithdrawView(views.APIView):
    """Candidate withdraws their own application."""
    permission_classes = [IsCandidateUserRole]

    def patch(self, request, pk):
        try:
            application = JobApplication.objects.select_related('candidate__user').get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        if application.candidate.user != request.user:
            return Response({'error': 'You can only withdraw your own applications.'}, status=status.HTTP_403_FORBIDDEN)

        if application.status in ('SELECTED', 'REJECTED'):
            return Response({'error': f"Cannot withdraw an application that is already '{application.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        application.status = 'WITHDRAWN'
        application.save()

        return Response({
            'message': 'Application has been withdrawn successfully.',
            'application': JobApplicationSerializer(application).data
        })


class AdminApplicationsListView(generics.ListAPIView):
    """Admin view for all applications in the entire platform."""
    permission_classes = [IsAdminUserRole]
    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.select_related('job__recruiter__user', 'candidate__user').order_by('-applied_at')


class ApplicationResumeDownloadView(views.APIView):
    """Secure download of the resume attached to an application."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            application = JobApplication.objects.select_related('job__recruiter__user', 'candidate__user').get(pk=pk)
        except JobApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        authorized = (
            user.role == 'ADMIN' or
            user.is_superuser or
            application.candidate.user == user or
            application.job.recruiter.user == user
        )

        if not authorized:
            return Response({'error': 'Access denied to this resume.'}, status=status.HTTP_403_FORBIDDEN)

        resume_field = application.resume_path or application.candidate.resume_path
        if not resume_field or not resume_field.name:
            return Response({'error': 'No resume attached to this application.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            file_path = resume_field.path
            return FileResponse(open(file_path, 'rb'), content_type='application/pdf', as_attachment=False)
        except (FileNotFoundError, ValueError):
            return Response({'error': 'Resume file could not be found on server storage.'}, status=status.HTTP_404_NOT_FOUND)
