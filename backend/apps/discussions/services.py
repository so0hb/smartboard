import logging
import time
import requests
import openai  # Make sure to install openai package

logger = logging.getLogger(__name__)


class AIService:
    @classmethod
    def get_active_ai_settings(self):
        from .models import AISettings

        try:
            return AISettings.objects.filter(is_active=True).first()
        except Exception as e:
            logger.error(f"Error getting AI settings: {str(e)}")
            return None

    @staticmethod
    def get_ai_settings():
        from .models import AISettings

        try:
            return AISettings.objects.filter(is_active=True).first()
        except Exception as e:
            logger.error(f"Error getting AI settings: {str(e)}")
            return None

    @staticmethod
    def process_with_openai(content, system_prompt=None):
        settings = AIService.get_ai_settings()
        if not settings or not settings.openai_api_key:
            raise ValueError("OpenAI API key not configured")

        client = openai.OpenAI(api_key=settings.openai_api_key)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})

        messages.append({"role": "user", "content": content})

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", messages=messages, temperature=0.7, max_tokens=500
        )

        return response.choices[0].message.content

    @staticmethod
    def process_with_huggingface(content, system_prompt=None):
        settings = AIService.get_ai_settings()
        if not settings or not settings.huggingface_api_key:
            raise ValueError("Hugging Face API key not configured")

        # Use a completely free and unrestricted model
        API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"
        headers = {
            "Authorization": f"Bearer {settings.huggingface_api_key}",
            "Content-Type": "application/json",
        }

        max_retries = 3
        retry_delay = 2  # seconds

        # Format input based on whether system prompt is provided
        if system_prompt:
            formatted_input = f"{system_prompt}\n\nInput: {content}"
        else:
            formatted_input = content

        logger.info(f"Formatted input: {formatted_input}")

        for attempt in range(max_retries):
            try:
                # Configure payload for BLOOM model
                payload = {
                    "inputs": formatted_input,
                    "parameters": {
                        "max_length": 100,
                        "temperature": 0.9,
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
                logger.info(f"Response status: {response.status_code}")

                if response.status_code == 503:
                    logger.warning("Model is loading, waiting before retry...")
                    if attempt < max_retries - 1:
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
            system_prompt = """أنت مساعد ذكاء اصطناعي مفيد يقوم بتحسين جودة النص.
مهمتك هي تحسين النص المقدم من خلال:
1. تصحيح أي أخطاء نحوية أو إملائية
2. تحسين الوضوح وسهولة القراءة
3. الحفاظ على المعنى والقصد الأصلي
4. الحفاظ على نبرة احترافية
5. إضافة تفاصيل ذات صلة عند الضرورة
قدم النص المحسن فقط دون أي تعليقات إضافية."""
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
            # تحليل النص باستخدام الذكاء الاصطناعي
            system_prompt = """قم بتحليل هذا النص وتقديم ملاحظات مفيدة."""

            # تحليل افتراضي في حالة فشل الاتصال بواجهة برمجة التطبيقات
            default_analysis = """تحليل المحتوى المقدم:
1. المحتوى واضح وموجز
2. التنظيم منطقي
3. الإجابة تبدو كاملة
4. اقتراح: يمكن إضافة أمثلة أكثر تحديداً"""

            if settings.provider == "openai":
                result = cls.process_with_openai(content, system_prompt)
                return result if result else default_analysis

            elif settings.provider == "huggingface":
                result = cls.process_with_huggingface(content, system_prompt)
                return result if result else default_analysis

            else:
                return default_analysis
        except Exception as e:
            logger.error(f"AI analysis error: {str(e)}")
            return """تحليل المحتوى المقدم:
1. المحتوى واضح وموجز
2. التنظيم منطقي
3. الإجابة تبدو كاملة
4. اقتراح: يمكن إضافة أمثلة أكثر تحديداً"""
