from django.contrib import admin
from .models import Question, QuestionMedia, Answer, AISettings

@admin.register(AISettings)
class AISettingsAdmin(admin.ModelAdmin):
    list_display = ['provider', 'is_active', 'created_at', 'updated_at']
    list_filter = ['provider', 'is_active']
    search_fields = ['provider']
