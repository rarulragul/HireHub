from rest_framework import serializers
from .models import JobApplication
from jobs.serializers import JobSerializer
from candidates.serializers import CandidateProfileSerializer

class JobApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    candidate = CandidateProfileSerializer(read_only=True)
    has_resume = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'candidate', 'resume_path', 'has_resume',
            'cover_letter', 'status', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'job', 'candidate', 'applied_at', 'updated_at', 'has_resume']

    def get_has_resume(self, obj):
        if obj.resume_path and obj.resume_path.name:
            return True
        if obj.candidate and obj.candidate.resume_path and obj.candidate.resume_path.name:
            return True
        return False


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'cover_letter', 'resume_path']
        read_only_fields = ['id']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['status']

    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in JobApplication.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status '{value}'. Allowed: {valid_statuses}")
        return value
