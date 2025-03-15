import json
import logging
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decouple import config
from transformers import AutoModelForCausalLM, AutoTokenizer

logger = logging.getLogger(__name__)

TOKEN = config("TELEGRAM_BOT_TOKEN")
TELEGRAM_API_URL = f"https://api.telegram.org/bot{TOKEN}"

model_name = "microsoft/DialoGPT-medium"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

def send_message(chat_id, text):
    url = f"{TELEGRAM_API_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    response = requests.post(url, json=payload)

    if response.status_code != 200:
        logger.error(f"Failed to send message: {response.text}")

def get_ai_response(message):
    try:
        inputs = tokenizer.encode(message + tokenizer.eos_token, return_tensors="pt")
        outputs = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id)
        ai_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        ai_response = ai_response[len(message):].strip()
        return ai_response
    except Exception as e:
        logger.error(f"Error with DialoGPT: {e}")
        return "Sorry, I couldn't process your request."

@csrf_exempt
def telegram_webhook(request):
    if request.method == "POST":
        try:
            data = request.read().decode("utf-8")
            logger.info(f"Raw Request Body: {data}")

            update = json.loads(data)
            if "message" in update:
                message = update["message"]
                chat_id = update["user_id"]
                user_message = message["text"]

                logger.info(f"Received message: {user_message}")

                ai_response = get_ai_response(user_message)

                send_message(chat_id, ai_response)

                return JsonResponse({"success": True, "message": ai_response})

            return JsonResponse({"error": "Invalid Telegram update structure"}, status=400)

        except json.JSONDecodeError:
            logger.error("Invalid JSON received")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except UnicodeDecodeError:
            logger.error("Failed to decode request body")
            return JsonResponse({"error": "Invalid encoding in request"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)
