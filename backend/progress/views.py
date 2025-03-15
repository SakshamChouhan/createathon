from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Progress
from .serializers import ProgressSerializer, UserProgressSerializer
from challenges.models import Challenge
from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView
from django.db.models import Count
from django.db import models


User = get_user_model()

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_progress(request):
    user = request.user
    challenge_id = request.data.get("challenge_id")
    code = request.data.get("code")

    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({"error": "Challenge not found"}, status=404)

    Progress.objects.update_or_create(
        user=user,
        challenge=challenge,
        defaults={"code": code, "is_completed": True},
    )

    return Response({"message": "Progress saved successfully!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_progress(request, challenge_id):
    user = request.user
    progress = Progress.objects.filter(user=user, challenge_id=challenge_id).first()

    return Response({"submitted": bool(progress), "code": progress.code if progress else None})


class UserProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total_challenges = Challenge.objects.count()
        submitted_challenges = Progress.objects.filter(user=user, is_completed=True).count()

        # Category-wise progress
        category_progress = {
            category: Progress.objects.filter(
                user=user, challenge__category=category, is_completed=True
            ).count()
            for category in Challenge.objects.values_list("category", flat=True).distinct()
        }


        # Difficulty-wise progress
        difficulty_levels = ["beginner", "intermediate", "advance"]
        difficulty_progress = {
            difficulty: Progress.objects.filter(
                user=user, challenge__difficulty=difficulty, is_completed=True
            ).count()
            for difficulty in difficulty_levels
        }
        
        

        return Response({
            "total_challenges": total_challenges,
            "submitted_challenges": submitted_challenges,
            "category_progress": category_progress,
            "difficulty_progress": difficulty_progress,
        })
    

class LeaderboardView(ListAPIView):
    """
    API to get leaderboard sorted by highest completed challenges.
    """
    serializer_class = UserProgressSerializer

    def get_queryset(self):
        return (
            User.objects.annotate(submitted_challenges=Count("progress", filter=models.Q(progress__is_completed=True)))
            .order_by("-submitted_challenges")[:10]  # Get top 10 users
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        leaderboard_data = [
            {
                "username": user.username,
                "submitted_challenges": user.submitted_challenges,
            }
            for user in queryset
        ]
        return Response(leaderboard_data)
