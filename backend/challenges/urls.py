from django.urls import path
from .views import ChallengeListView, ChallengeDetailView, AddChallengeView, add_test_case, run_user_code

urlpatterns = [
    path("", ChallengeListView.as_view(), name="challenge-list"),  # ✅ Correct
    path("<int:pk>/", ChallengeDetailView.as_view(), name="challenge-detail"),
    # path("<int:pk>/submit/", SubmitSolutionView.as_view(), name="submit-solution"),
    path("create/", AddChallengeView.as_view(), name="add-challenge"), 
    path("<int:challenge_id>/test-cases/", add_test_case, name="add_test_case"),
    path("<int:challenge_id>/run-code/", run_user_code, name="run_user_code"),
]

