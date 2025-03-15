import subprocess
import sys
import unicodedata
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Challenge, TestCase
from .serializers import ChallengeSerializer, TestCaseSerializer


class AddChallengeView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        if not request.user.is_staff:
            return Response({"error": "You must be an admin to add challenges."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChallengeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Challenge added successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChallengeListView(generics.ListAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [AllowAny]


class ChallengeDetailView(generics.RetrieveAPIView):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [AllowAny]


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def add_test_case(request, challenge_id):
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        test_cases = TestCase.objects.filter(challenge=challenge)
        serializer = TestCaseSerializer(test_cases, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = TestCaseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(challenge=challenge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def run_user_code(request, challenge_id):
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return Response({"error": "Challenge not found"}, status=status.HTTP_404_NOT_FOUND)

    test_cases = TestCase.objects.filter(challenge=challenge)
    if not test_cases.exists():
        return Response({"error": "No test cases found for this challenge"}, status=status.HTTP_400_BAD_REQUEST)

    user_code = request.data.get("code")
    language = request.data.get("language")

    if not user_code or not language:
        return Response({"error": "Code or language missing"}, status=status.HTTP_400_BAD_REQUEST)

    results = []
    
    for test_case in test_cases:
        try:
            input_data = test_case.input_data
            expected_output = test_case.expected_output.strip()

            if language == "python":
                command = [sys.executable, "-c", user_code]
            elif language == "cpp":
                with open("temp.cpp", "w") as f:
                    f.write(user_code)

                compile_process = subprocess.run(["g++", "temp.cpp", "-o", "temp"], capture_output=True, text=True)
                if compile_process.returncode != 0:
                    return Response({"error": "Compilation failed", "details": compile_process.stderr}, status=status.HTTP_400_BAD_REQUEST)

                command = ["./temp"]
            elif language == "javascript":
                command = ["node", "-e", user_code]
            else:
                return Response({"error": "Unsupported language"}, status=status.HTTP_400_BAD_REQUEST)

            process = subprocess.run(
                command,
                input=input_data,
                text=True,
                capture_output=True,
                timeout=5
            )

            user_output = process.stdout.strip()
            user_output = unicodedata.normalize("NFKC", user_output)
            expected_output = unicodedata.normalize("NFKC", expected_output)

            user_output = " ".join(user_output.split())
            expected_output = " ".join(expected_output.split())

            try:
                user_output_floats = [round(float(x), 4) for x in user_output.split()]
                expected_output_floats = [round(float(x), 4) for x in expected_output.split()]
                passed = user_output_floats == expected_output_floats
            except ValueError:
                passed = user_output == expected_output

            results.append({
                "input": test_case.input_data,
                "expected_output": expected_output,
                "user_output": user_output,
                "passed": passed
            })

        except subprocess.TimeoutExpired:
            results.append({
                "input": test_case.input_data,
                "expected_output": test_case.expected_output,
                "user_output": "TIMEOUT",
                "passed": False
            })

    return Response({"results": results}, status=status.HTTP_200_OK)
