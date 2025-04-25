from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from .models import Question, QuestionMedia, Answer, AISettings
from .serializers import QuestionSerializer, QuestionMediaSerializer, AnswerSerializer, AISettingsSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action, api_view
import requests

# Create your views here.

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Get user_id from request data
        user_id = self.request.data.get('user_id')
        if not user_id:
            raise ValidationError({'user_id': 'This field is required.'})
            
        # Get user instance
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise ValidationError({'user_id': 'Invalid user ID.'})
        
        try:
            # Create question first
            question = serializer.save(user=user)
            
            # Handle file uploads
            files = self.request.FILES.getlist('files')
            for file in files:
                QuestionMedia.objects.create(
                    question=question,
                    file=file,
                    file_type=file.content_type
                )
            
            return question
        except Exception as e:
            # If something goes wrong, delete the question and its files
            if 'question' in locals():
                question.delete()
            raise ValidationError(str(e))

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Question.DoesNotExist:
            return Response(
                {"detail": "Question not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def answers(self, request, pk=None):
        try:
            question = self.get_object()
            user_id = request.data.get('user_id')
            content = request.data.get('content')

            if not user_id or not content:
                return Response(
                    {'error': 'Both user_id and content are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get user instance
            User = get_user_model()
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'Invalid user ID'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create answer instance
            answer = Answer(
                question=question,
                user=user,
                content=content,
                moderation_status='pending'
            )

            # Check for duplicates before saving
            if answer.check_duplicate(question.id):
                return Response({
                    'error': 'Similar answer already exists',
                    'status': 'duplicate',
                    'similarity_score': answer.similarity_score
                }, status=status.HTTP_400_BAD_REQUEST)

            # Save the answer
            answer.save()

            serializer = AnswerSerializer(answer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AISettingsViewSet(viewsets.ModelViewSet):
    queryset = AISettings.objects.all()
    serializer_class = AISettingsSerializer
    # permission_classes = [IsAuthenticated]  # Add appropriate permissions

    def perform_create(self, serializer):
        try:
            # Validate the API key before saving
            provider = self.request.data.get('provider')
            api_key = (
                self.request.data.get('openai_api_key')
                if provider == 'openai'
                else self.request.data.get('huggingface_api_key')
            )
            
            if not api_key:
                raise ValidationError(f'{provider} API key is required')

            # Test the API key
            if provider == 'huggingface':
                try:
                    from huggingface_hub import HfApi
                    api = HfApi(token=api_key)
                    api.whoami()
                except Exception as e:
                    raise ValidationError(f'Invalid Hugging Face API key: {str(e)}')

            # Deactivate other settings
            AISettings.objects.all().update(is_active=False)
            
            # Save the new settings
            instance = serializer.save()
            
            return Response(
                AISettingsSerializer(instance).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            raise ValidationError(str(e))

    def perform_update(self, serializer):
        try:
            if serializer.validated_data.get('is_active', False):
                AISettings.objects.exclude(pk=serializer.instance.pk).update(is_active=False)
            serializer.save()
        except Exception as e:
            raise ValidationError(str(e))

    @action(detail=True, methods=['get'])
    def get_api_key(self, request, pk=None):
        try:
            instance = self.get_object()
            if instance.provider == 'openai':
                return Response({'api_key': instance.openai_api_key})
            else:
                return Response({'api_key': instance.huggingface_api_key})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['POST'])
def verify_ai_settings(request):
    provider = request.data.get('provider')
    api_key = request.data.get('api_key')
    
    if not provider or not api_key:
        return Response({
            'valid': False,
            'error': 'Provider and API key are required'
        })
    
    try:
        if provider == 'huggingface':
            # Test with a simple API call
            API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
            headers = {"Authorization": f"Bearer {api_key}"}
            
            # Make a small test request
            response = requests.post(
                API_URL,
                headers=headers,
                json={
                    "inputs": "Hello",
                    "options": {"wait_for_model": True}
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return Response({'valid': True})
            elif response.status_code == 401:
                return Response({
                    'valid': False,
                    'error': 'Invalid API key'
                })
            elif response.status_code == 503:
                return Response({
                    'valid': False,
                    'error': 'Service temporarily unavailable. Please try again later.'
                })
            else:
                return Response({
                    'valid': False,
                    'error': f'API error: {response.status_code}'
                })
                
        return Response({'valid': False, 'error': 'Unsupported provider'})
        
    except requests.exceptions.Timeout:
        return Response({
            'valid': False,
            'error': 'Request timed out. Please try again.'
        })
    except Exception as e:
        return Response({
            'valid': False,
            'error': str(e)
        })
