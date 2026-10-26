from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from candidates.models import CandidateProfile
from recruiters.models import RecruiterProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'password', 'confirm_password']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        
        # Security: Prevent public registration from assigning the ADMIN role
        role = attrs.get('role', 'CANDIDATE')
        if role not in ('CANDIDATE', 'RECRUITER'):
            raise serializers.ValidationError({"role": "Invalid registration role. Admin registration is prohibited."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        role = validated_data.get('role', 'CANDIDATE')

        user = User.objects.create_user(password=password, **validated_data)

        # Automatically create profile linked to user
        if role == 'CANDIDATE':
            CandidateProfile.objects.create(user=user)
        elif role == 'RECRUITER':
            RecruiterProfile.objects.create(user=user)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email').lower().strip()
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Invalid email or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Account has been deactivated. Please contact an administrator."})

        refresh = RefreshToken.for_user(user)

        return {
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, min_length=6, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'date_joined', 'updated_at']
        read_only_fields = ['id', 'email', 'date_joined', 'updated_at']
