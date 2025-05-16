from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
from .serializers import ReviewsSerializer
from .models import Reviews
from .permissions import IsOwner
from users.serializers import UserSerializer

class ReviewsListCreateAPIView(viewsets.ModelViewSet):
    user = UserSerializer(read_only=True)
    serializer_class = ReviewsSerializer
    queryset = Reviews.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]

    class Meta:
        model = Reviews
        fields = ['id', 'game', 'rating', 'comment', 'created_at', 'updated_at', 'user']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)