from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAdminUser
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()

# Global function for standardized response
def response_format(data=None, error=None, status_code=status.HTTP_200_OK):
    return Response({"data": data, "error": error}, status=status_code)


# User Registration View
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return response_format(
                data={
                    "user": {
                        "id": user.id,
                        **serializer.data
                    },
                    "token": token.key
                },
                status_code=status.HTTP_201_CREATED
            )
        return response_format(error=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)


# User Login View
class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user = authenticate(username=username, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return response_format(
                    data={
                        "user": {
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "role": getattr(user, "role", None),
                        },
                        "token": token.key,
                    }
                )
            return response_format(error="Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED)
        return response_format(error=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)


# Get All Users (Admin only)
class GetAllUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAdminUser]


# Update User (Admin only)
class UpdateUserView(APIView):
    # permission_classes = [IsAdminUser]

    def put(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return response_format(data=serializer.data)
            
            return response_format(
                error=serializer.errors, 
                status_code=status.HTTP_400_BAD_REQUEST
            )
            
        except User.DoesNotExist:
            return response_format(
                error="User not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return response_format(
                error=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Delete User (Admin only)
class DeleteUserView(APIView):
    # permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
            user.delete()
            return response_format(
                data="User deleted successfully", 
                status_code=status.HTTP_204_NO_CONTENT
            )
        except User.DoesNotExist:
            return response_format(
                error="User not found",
                status_code=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return response_format(
                error=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Delete All Users (Admin only)
class DeleteAllUsersView(APIView):
    # permission_classes = [IsAdminUser]

    def delete(self, request):
        User.objects.all().delete()
        return response_format(data="All users deleted successfully", status_code=status.HTTP_204_NO_CONTENT)
