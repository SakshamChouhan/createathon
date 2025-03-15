from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .models import CustomUser
from .serializers import UserSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Return the profile details of the logged-in user."""
    user = request.user

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "password": user.password,  # Hide password
            "date_joined": user.date_joined.strftime("%Y-%m-%d"),  # Format date
        },
        status=status.HTTP_200_OK
    )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already taken!"}, status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email already registered!"}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
        )

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_input = request.data.get("username")  # Can be username or email
        password = request.data.get("password")

        if not user_input or not password:
            return Response({"error": "Both fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check for user by email or username
        user = CustomUser.objects.filter(email=user_input).first() or \
               CustomUser.objects.filter(username=user_input).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
