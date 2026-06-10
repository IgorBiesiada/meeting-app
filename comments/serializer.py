from rest_framework import serializers
from comments.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    model = Comment
    fields = ['meeting','author', 'text', 'created_at']