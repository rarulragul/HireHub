from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    AdminUserSerializer
)
from common.permissions import IsAdminUserRole

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Registration successful.',
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CurrentUserView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        # Attach profile ID if applicable
        if request.user.role == 'CANDIDATE' and hasattr(request.user, 'candidate_profile'):
            data['profile_id'] = request.user.candidate_profile.id
        elif request.user.role == 'RECRUITER' and hasattr(request.user, 'recruiter_profile'):
            data['profile_id'] = request.user.recruiter_profile.id
        return Response(data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)


class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "Logout completed."}, status=status.HTTP_200_OK)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdminUserRole]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all().order_by('-date_joined')

    def get_queryset(self):
        qs = super().get_queryset()
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(full_name__icontains=search) | qs.filter(email__icontains=search)
        return qs


class AdminUserStatusUpdateView(views.APIView):
    permission_classes = [IsAdminUserRole]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_superuser:
            return Response({'error': 'Superuser status cannot be modified via this endpoint.'}, status=status.HTTP_400_BAD_REQUEST)

        is_active = request.data.get('is_active')
        if is_active is not None:
            user.is_active = bool(is_active)
            user.save()

        return Response({
            'message': f"User account has been {'activated' if user.is_active else 'deactivated'}.",
            'user': AdminUserSerializer(user).data
        })
