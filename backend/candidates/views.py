import os
from django.http import FileResponse, Http404
from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer
from common.permissions import IsCandidateUserRole
from common.validators import validate_resume_file
from applications.models import JobApplication

class CandidateMeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get(self, request):
        profile = self.get_object()
        serializer = CandidateProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = self.get_object()
        serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CandidateResumeUploadView(views.APIView):
    permission_classes = [IsCandidateUserRole]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'resume' not in request.FILES:
            return Response({'error': 'No resume file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['resume']
        try:
            validate_resume_file(file)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = CandidateProfile.objects.get_or_create(user=request.user)

        # Remove old resume file if exists
        if profile.resume_path and os.path.isfile(profile.resume_path.path):
            try:
                os.remove(profile.resume_path.path)
            except OSError:
                pass

        profile.resume_path = file
        profile.save()

        return Response({
            'message': 'Resume uploaded successfully.',
            'profile': CandidateProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)


class CandidateResumeDownloadView(views.APIView):
    """
    Secure resume download:
    - Candidate themselves can download their resume.
    - Recruiter can download if candidate applied to any of their jobs.
    - Admin can download.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            try:
                profile = CandidateProfile.objects.get(pk=pk)
            except CandidateProfile.DoesNotExist:
                raise Http404("Candidate profile not found")
        else:
            profile, _ = CandidateProfile.objects.get_or_create(user=request.user)

        # Authorization check
        user = request.user
        authorized = False

        if user.role == 'ADMIN' or user.is_superuser:
            authorized = True
        elif user == profile.user:
            authorized = True
        elif user.role == 'RECRUITER' and hasattr(user, 'recruiter_profile'):
            # Check if this candidate applied to any job owned by this recruiter
            applied = JobApplication.objects.filter(
                candidate=profile,
                job__recruiter=user.recruiter_profile
            ).exists()
            if applied:
                authorized = True

        if not authorized:
            return Response({'error': 'You do not have permission to access this resume.'}, status=status.HTTP_403_FORBIDDEN)

        if not profile.resume_path or not profile.resume_path.name:
            return Response({'error': 'No resume uploaded for this candidate.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            file_path = profile.resume_path.path
            return FileResponse(open(file_path, 'rb'), content_type='application/pdf', as_attachment=False)
        except (FileNotFoundError, ValueError):
            return Response({'error': 'Resume file could not be found on server storage.'}, status=status.HTTP_404_NOT_FOUND)
