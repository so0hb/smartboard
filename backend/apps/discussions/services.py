import openai
from transformers import pipeline
import requests
import logging
import time

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        from django.conf import settings

        self.settings = self.get_active_ai_settings()
        logger.info(
            f"AI Provider: {self.settings.provider if self.settings else 'None'}"
        )
        logger.info(
            f"Has HF Key: {bool(self.settings.huggingface_api_key) if self.settings else False}"
        )

    def get_active_ai_settings(self):
        from .models import AISettings

        return AISettings.objects.filter(is_active=True).first()

    @staticmethod
    def get_ai_settings():
        from .models import AISettings

        return AISettings.get_active_settings()

    @staticmethod
    def process_with_openai(content, system_prompt):
        settings = AIService.get_ai_settings()
        if not settings or not settings.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        from openai import OpenAI  # Import the new client

        client = OpenAI(api_key=settings.openai_api_key)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content},
            ],
            temperature=0.7,
        )

        return response.choices[0].message.content

    @staticmethod
    def process_with_huggingface(content, system_prompt=None):
        settings = AIService.get_ai_settings()
        if not settings or not settings.huggingface_api_key:
            raise ValueError("Hugging Face API key not configured")

        # Use Llama 2 model
        API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"
        headers = {
            "Authorization": "{Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx}",
            "Content-Type": "application/json",
        }

        max_retries = 3
        retry_delay = 2  # seconds

        # Format the input in Llama 2 chat format
        if system_prompt:
            formatted_input = f"""<s>[INST] <<SYS>>
{system_prompt}
<</SYS>>

{content} [/INST]"""
        else:
            formatted_input = f"<s>[INST] {content} [/INST]"

        for attempt in range(max_retries):
            try:
                # Configure payload for Llama 2
                payload = {
                    "inputs": formatted_input,
                    "parameters": {
                        "max_new_tokens": 512,
                        "temperature": 0.7,
                        "top_p": 0.95,
                        "do_sample": True,
                        "return_full_text": False,
                    },
                }

                logger.info(f"Sending request to Hugging Face API: {payload}")

                response = requests.post(
                    API_URL,
                    headers=headers,
                    json=payload,
                    timeout=45,  # Increased timeout for larger model
                )

                # Log the response for debugging
                logger.info(f"Hugging Face API Response Status: {response.status_code}")
                logger.info(f"Hugging Face API Response: {response.text}")

                if response.status_code == 503:
                    if attempt < max_retries - 1:
                        logger.warning("Model is loading, waiting before retry...")
                        time.sleep(retry_delay * 2)  # Longer wait for large model
                        continue
                    raise ValueError("Hugging Face service is temporarily unavailable")

                response.raise_for_status()
                result = response.json()

                # Handle Llama 2 response format
                if isinstance(result, list) and len(result) > 0:
                    if isinstance(result[0], dict):
                        # Extract generated text
                        text = result[0].get("generated_text", "")
                        if not text:
                            raise ValueError(f"No text found in response: {result}")

                        # Clean up Llama 2 specific formatting
                        generated_text = text.strip()
                        generated_text = generated_text.replace("<s>", "").replace(
                            "</s>", ""
                        )
                        generated_text = generated_text.replace("[INST]", "").replace(
                            "[/INST]", ""
                        )
                        generated_text = generated_text.replace("<<SYS>>", "").replace(
                            "<</SYS>>", ""
                        )

                        # Remove the system prompt and input from the response
                        if system_prompt:
                            generated_text = generated_text.replace(
                                system_prompt, ""
                            ).strip()
                            generated_text = generated_text.replace(content, "").strip()

                        return generated_text
                    elif isinstance(result[0], str):
                        return result[0].strip()

                raise ValueError(
                    f"Unexpected response format from Hugging Face API: {result}"
                )

            except requests.exceptions.Timeout:
                if attempt < max_retries - 1:
                    logger.warning("Request timed out, retrying...")
                    time.sleep(retry_delay * 2)
                    continue
                raise ValueError("Request to Hugging Face API timed out")

            except requests.exceptions.RequestException as e:
                logger.error(f"Hugging Face API error: {str(e)}")
                if attempt < max_retries - 1:
                    logger.warning("Request failed, retrying...")
                    time.sleep(retry_delay)
                    continue
                raise ValueError(f"Error communicating with Hugging Face API: {str(e)}")

            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                if attempt < max_retries - 1:
                    logger.warning("Unexpected error, retrying...")
                    time.sleep(retry_delay)
                    continue
                raise ValueError(
                    f"Unexpected error processing with Hugging Face: {str(e)}"
                )

    @classmethod
    def process_content(cls, content, task_type="improve"):
        settings = cls.get_ai_settings()
        if not settings:
            return content

        try:
            # Llama 2 optimized system prompt
            system_prompt = """You are a helpful AI assistant that improves text quality.
Your task is to enhance the given text by:
1. Fixing any grammar or spelling errors
2. Improving clarity and readability
3. Maintaining the original meaning and intent
4. Keeping a professional tone
5. Adding relevant details when necessary

Provide only the improved text without any additional commentary."""

            if settings.provider == "openai":
                return cls.process_with_openai(content, system_prompt)

            elif settings.provider == "huggingface":
                return cls.process_with_huggingface(content, system_prompt)

            else:
                return content

        except Exception as e:
            logger.error(f"AI processing error: {str(e)}")
            return content

    @classmethod
    def analyze_content(cls, content):
        settings = cls.get_ai_settings()
        if not settings:
            return None

        try:
            # Llama 2 optimized analysis prompt
            system_prompt = """You are an expert content analyzer.
Provide a concise assessment of the following text, covering:
1. Content accuracy and factual correctness
2. Clarity and organization of ideas
3. Completeness of the response
4. Specific suggestions for improvement

Keep your analysis brief and actionable."""

            if settings.provider == "openai":
                return cls.process_with_openai(content, system_prompt)

            elif settings.provider == "huggingface":
                return cls.process_with_huggingface(content, system_prompt)

            else:
                return None

        except Exception as e:
            logger.error(f"AI analysis error: {str(e)}")
            return None
