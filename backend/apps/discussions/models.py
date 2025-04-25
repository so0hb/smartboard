from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
import os
import openai  # Make sure to install openai package
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db.models import Q
from difflib import SequenceMatcher
from .services import AIService

def question_file_path(instance, filename):
    # Generate path: media/questions/user_id/question_id/filename
    return os.path.join('questions', str(instance.question.user.id), str(instance.question.id), filename)

class Question(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('technical', 'Technical'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class QuestionMedia(models.Model):
    question = models.ForeignKey(Question, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to=question_file_path)
    file_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.question.title} - {self.file.name}"

class Answer(models.Model):
    MODERATION_STATUS = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('flagged', 'Flagged'),
        ('rejected', 'Rejected')
    ]

    question = models.ForeignKey('Question', related_name='answers', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    original_content = models.TextField(blank=True, null=True)
    ai_analysis = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    moderation_status = models.CharField(max_length=20, choices=MODERATION_STATUS, default='pending')
    moderation_score = models.FloatField(default=0.0)
    moderation_categories = models.JSONField(null=True, blank=True)
    is_duplicate = models.BooleanField(default=False)
    similarity_score = models.FloatField(default=0.0)

    def check_duplicate(self, question_id):
        """
        Check if this answer is similar to existing answers for the same question
        Returns True if a similar answer is found, False otherwise
        """
        # Get all existing answers for this question except the current one
        existing_answers = Answer.objects.filter(
            question_id=question_id
        ).exclude(id=self.id if self.id else None)

        for existing_answer in existing_answers:
            # Use SequenceMatcher to calculate similarity
            similarity = SequenceMatcher(
                None,
                self.content.lower(),
                existing_answer.content.lower()
            ).ratio()

            # Store the highest similarity score
            self.similarity_score = max(self.similarity_score, similarity)

            # If similarity is above threshold, mark as duplicate
            if similarity > 0.8:  # 80% similarity threshold
                self.is_duplicate = True
                return True

        return False

    def save(self, *args, **kwargs):
        # Only check for duplicates on new answers
        if not self.pk:
            self.check_duplicate(self.question_id)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Answer to {self.question.title} by {self.user}"

@receiver(pre_save, sender=Answer)
def process_answer_content(sender, instance, **kwargs):
    """Process answer content with AI before saving"""
    if not instance.pk and not instance.original_content:  # Only process new answers
        try:
            # Store original content
            instance.original_content = instance.content

            # Improve content with AI
            improved_content = AIService.process_content(instance.content)
            if improved_content:
                instance.content = improved_content

            # Get content analysis
            analysis = AIService.analyze_content(instance.content)
            if analysis:
                instance.ai_analysis = analysis
                instance.moderation_status = 'approved'
            else:
                instance.moderation_status = 'pending'

        except Exception as e:
            print(f"AI processing error: {str(e)}")
            # Keep original content if processing fails
            instance.content = instance.original_content
            instance.moderation_status = 'pending'

    def moderate_content(self):
        """
        Use OpenAI's moderation API to check content
        """
        try:
            response = openai.Moderation.create(input=self.content)
            result = response["results"][0]
            
            # Store moderation results
            self.moderation_score = result["flagged"]
            self.moderation_categories = result["categories"]
            
            # Update status based on moderation
            if result["flagged"]:
                self.moderation_status = 'flagged'
            else:
                self.moderation_status = 'approved'
            
            self.save()
            return result["flagged"]
        except Exception as e:
            print(f"Moderation error: {str(e)}")
            return False

    @staticmethod
    def cosine_similarity(v1, v2):
        """Calculate cosine similarity between two vectors"""
        import numpy as np
        return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

class AISettings(models.Model):
    provider = models.CharField(max_length=20, choices=[
        ('openai', 'OpenAI'),
        ('huggingface', 'Hugging Face')
    ])
    is_active = models.BooleanField(default=True)
    openai_api_key = models.CharField(max_length=255, blank=True, null=True)
    huggingface_api_key = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Ensure only one active setting at a time
        if self.is_active:
            AISettings.objects.exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def clean(self):
        from django.core.exceptions import ValidationError
        # Validate that the appropriate API key is set based on provider
        if self.provider == 'huggingface' and not self.huggingface_api_key:
            raise ValidationError('Hugging Face API key is required when using Hugging Face provider')
        elif self.provider == 'openai' and not self.openai_api_key:
            raise ValidationError('OpenAI API key is required when using OpenAI provider')

    def __str__(self):
        return f"AI Settings - {self.provider}"

    @classmethod
    def get_active_settings(cls):
        return cls.objects.filter(is_active=True).first()
