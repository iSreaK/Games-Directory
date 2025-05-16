from rest_framework import serializers
from reviews.models import Reviews


class ReviewsSerializer(serializers.ModelSerializer):
    # game_title = serializers.ReadOnlyField(source='game.title')

    class Meta:
        model = Reviews
        fields = ['id', 'game', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
