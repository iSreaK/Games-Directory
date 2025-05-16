from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
from .serializers import GameSerializer, ReviewSerializer
from .models import Game, Review
from .permissions import IsOwner
from rest_framework.response import Response
from rest_framework.decorators import action

class GameListAPIView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()

    @action(detail=True, methods=['get'], url_path='reviews')
    def reviews(self, request, pk=None):
        game = self.get_object()
        reviews = Review.objects.filter(game=game)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ReviewListCreateAPIView(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)