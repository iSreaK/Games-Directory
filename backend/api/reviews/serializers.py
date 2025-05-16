from rest_framework import serializers
from reviews.models import Reviews
from django.contrib.auth.models import User


class OnlyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class ReviewsSerializer(serializers.ModelSerializer):
    user = OnlyUserSerializer(read_only=True)

    class Meta:
        model = Reviews
        fields = ['id', 'game', 'rating', 'comment', 'created_at', 'updated_at', 'user']
        read_only_fields = ['id', 'created_at', 'updated_at']

class OnlyReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = ['id', 'game', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']