from rest_framework import serializers
from .models import RecruiterProfile
from accounts.serializers import UserSerializer

class RecruiterProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = RecruiterProfile
        fields = [
            'id', 'user', 'full_name', 'email', 'company_name', 
            'company_description', 'company_website', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
