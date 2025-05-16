from rest_framework import serializers
from review.models import Game, Review


class ReviewSerializer(serializers.ModelSerializer):
    # game_title = serializers.ReadOnlyField(source='game.title')

    class Meta:
        model = Review
        fields = ['id', 'game', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class GameSerializer(serializers.ModelSerializer):
    platforms = serializers.StringRelatedField(many=True)
    genres = serializers.StringRelatedField(many=True)
    developers = serializers.StringRelatedField(many=True)
    publishers = serializers.StringRelatedField(many=True)

    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'
