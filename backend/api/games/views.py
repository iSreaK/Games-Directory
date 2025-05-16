from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .serializers import GameSerializer
from .models import Game
from rest_framework.response import Response
from rest_framework.decorators import action
from reviews.serializers import ReviewsSerializer
from reviews.models import Reviews

class GameListAPIView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    @action(detail=True, methods=['get'], url_path='reviews')
    def reviews(self, request, pk=None):
        game = self.get_object()
        reviews = Reviews.objects.filter(game=game)
        serializer = ReviewsSerializer(reviews, many=True)
        return Response(serializer.data)