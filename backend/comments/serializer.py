from rest_framework import serializers
from comments.models import Comment
from groq import Groq
from config.settings import GROQ_API_KEY
import json

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['text']

    def validate_text(self, text):
        client = Groq(api_key=GROQ_API_KEY)

        try:
            completion = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": "Jesteś teraz systemem do sprawdzanią toksyczności komentarzy. Odpowiedz w formacie JSON: {\"is_toxic\": true} lub {\"is_toxic\": false}."
                    },
                    {
                        "role": "user",
                        "content": text  
                    }

            ],
                response_format={"type": "json_object"},
                temperature=0,
            )       
            message = completion.choices[0].message.content
            result = json.loads(message)
            
        except Exception as e:
            print(f"Błąd groq api {e}")

        if result.get("is_toxic"):
            raise serializers.ValidationError("Twoj komentarz jest za toksyczny")

        return text