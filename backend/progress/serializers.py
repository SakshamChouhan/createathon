from rest_framework import serializers
from .models import Progress

class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = "__all__"
        
class UserProgressSerializer(serializers.Serializer):
    total_challenges = serializers.IntegerField()
    submitted_challenges = serializers.IntegerField()
    category_progress = serializers.DictField(child=serializers.IntegerField())
    difficulty_progress = serializers.DictField(child=serializers.IntegerField())