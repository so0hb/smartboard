from rest_framework import serializers
from .models import Question, QuestionMedia, Answer, AISettings

class QuestionMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionMedia
        fields = ['id', 'file', 'file_type', 'created_at']

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = [
            'id', 'content', 'original_content', 'ai_analysis',
            'created_at', 'updated_at', 'user',
            'moderation_status', 'is_duplicate', 'similarity_score'
        ]
        read_only_fields = [
            'user', 'moderation_status', 'is_duplicate', 
            'similarity_score', 'original_content', 'ai_analysis'
        ]

class QuestionSerializer(serializers.ModelSerializer):
    media = QuestionMediaSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'title', 'content', 'category', 'user', 'created_at', 'updated_at', 'media', 'answers']
        read_only_fields = ['user']

class AISettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISettings
        fields = ['id', 'provider', 'is_active', 'openai_api_key', 'huggingface_api_key', 'created_at', 'updated_at']
        extra_kwargs = {
            'openai_api_key': {'write_only': False},  # Allow reading API keys
            'huggingface_api_key': {'write_only': False}
        }

    def to_representation(self, instance):
        # Mask API keys in responses
        data = super().to_representation(instance)
        if 'openai_api_key' in data and data['openai_api_key']:
            data['openai_api_key'] = '********'
        if 'huggingface_api_key' in data and data['huggingface_api_key']:
            data['huggingface_api_key'] = '********'
        return data

    def validate(self, data):
        provider = data.get('provider')
        openai_key = data.get('openai_api_key')
        huggingface_key = data.get('huggingface_api_key')

        if provider == 'openai' and not openai_key:
            raise serializers.ValidationError({'openai_api_key': 'OpenAI API key is required'})
        elif provider == 'huggingface' and not huggingface_key:
            raise serializers.ValidationError({'huggingface_api_key': 'Hugging Face API key is required'})

        return data
