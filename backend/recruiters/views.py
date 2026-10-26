from rest_framework import views, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import RecruiterProfile
from .serializers import RecruiterProfileSerializer
from common.permissions import IsRecruiterUserRole

class RecruiterMeView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = RecruiterProfile.objects.get_or_create(user=self.request.user)
        return profile

    def get(self, request):
        profile = self.get_object()
        serializer = RecruiterProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = self.get_object()
        serializer = RecruiterProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class RecruiterDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = RecruiterProfile.objects.all()
    serializer_class = RecruiterProfileSerializer
