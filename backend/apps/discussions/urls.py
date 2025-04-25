from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, AISettingsViewSet, verify_ai_settings

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'ai-settings', AISettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ai-settings/verify/', verify_ai_settings, name='verify-ai-settings'),
]
