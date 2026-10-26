from rest_framework import serializers
from .models import Job
from recruiters.serializers import RecruiterProfileSerializer

class JobSerializer(serializers.ModelSerializer):
    recruiter = RecruiterProfileSerializer(read_only=True)
    company_name = serializers.CharField(source='recruiter.company_name', read_only=True)
    total_applicants = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'required_skills', 'department',
            'location', 'employment_type', 'experience_required', 'salary_min',
            'salary_max', 'status', 'recruiter', 'company_name', 'application_deadline',
            'created_at', 'updated_at', 'total_applicants', 'has_applied'
        ]
        read_only_fields = ['id', 'recruiter', 'created_at', 'updated_at', 'total_applicants', 'has_applied']

    def get_total_applicants(self, obj):
        return obj.applications.count()

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'CANDIDATE':
            if hasattr(request.user, 'candidate_profile'):
                return obj.applications.filter(candidate=request.user.candidate_profile).exists()
        return False


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'required_skills', 'department',
            'location', 'employment_type', 'experience_required', 'salary_min',
            'salary_max', 'status', 'application_deadline'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        if salary_min is not None and salary_max is not None and salary_min > salary_max:
            raise serializers.ValidationError({"salary_max": "Maximum salary cannot be less than minimum salary."})
        return attrs
