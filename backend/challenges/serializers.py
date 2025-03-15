from rest_framework import serializers
from .models import Challenge, Submission, TestCase

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'
        extra_kwargs = {
            'difficulty': {'required': True},
            'points': {'required': True},
            'category': {'required': True},
        }

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission  # Ensure Submission model exists in models.py
        fields = ["user", "challenge", "code", "submitted_at"]
class TestCaseSerializer(serializers.ModelSerializer):
    challenge = serializers.PrimaryKeyRelatedField(read_only=True)  # ✅ Now it's read-only

    class Meta:
        model = TestCase
        fields = ["id", "challenge", "input_data", "expected_output"]
