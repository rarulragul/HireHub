from rest_framework import serializers
from .models import CandidateProfile
from accounts.serializers import UserSerializer

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    has_resume = serializers.SerializerMethodField()

    class Meta:
        model = CandidateProfile
        fields = [
            'id', 'user', 'full_name', 'email', 'phone', 'location', 
            'education', 'experience_years', 'skills', 'resume_path', 
            'has_resume', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'has_resume']

    def get_has_resume(self, obj):
        return bool(obj.resume_path and obj.resume_path.name)
