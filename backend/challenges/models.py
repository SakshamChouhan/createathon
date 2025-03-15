from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Challenge(models.Model):
    DSA_CATEGORIES = [
        ('arrays', 'Arrays'),
        ('strings', 'Strings'),
        ('linked_list', 'Linked List'),
        ('stacks', 'Stacks'),
        ('queues', 'Queues'),
        ('recursion', 'Recursion'),
        ('dynamic_programming', 'Dynamic Programming'),
        ('graph', 'Graph'),
        ('tree', 'Tree'),
        ('greedy', 'Greedy'),
        ('bit_manipulation', 'Bit Manipulation'),
        ('math', 'Math'),
        ('miscellaneous', 'Miscellaneous'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ]
    )
    points = models.IntegerField()
    category = models.CharField(max_length=30, choices=DSA_CATEGORIES)
    created_at = models.DateTimeField(auto_now_add=True)

    def validate_submission(self, code):
        # Add logic to check if the submitted code is correct
        return True  # Placeholder, replace with real validation logic


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    code = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)


class TestCase(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name="test_cases")
    input_data = models.TextField()
    expected_output = models.TextField()

    def __str__(self):
        return f"Test Case for {self.challenge.title}"
