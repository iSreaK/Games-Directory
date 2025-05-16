from rest_framework import serializers
from reviews.models import Game
from reviews.serializers import ReviewsSerializer

class GameSerializer(serializers.ModelSerializer):
    platforms = serializers.StringRelatedField(many=True)
    genres = serializers.StringRelatedField(many=True)
    developers = serializers.StringRelatedField(many=True)
    publishers = serializers.StringRelatedField(many=True)

    reviews = ReviewsSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = '__all__'