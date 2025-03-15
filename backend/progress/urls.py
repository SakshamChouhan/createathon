from django.urls import path
from .views import save_progress, get_progress, UserProgressView, LeaderboardView

urlpatterns = [
    path("save/", save_progress, name="save_progress"),
    path("<int:challenge_id>/", get_progress, name="get_progress"),
    path("summary/", UserProgressView.as_view(), name="user-progress"),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"), 
]
