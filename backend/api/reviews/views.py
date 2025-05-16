from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, permissions
from .serializers import ReviewsSerializer
from .models import Reviews
from .permissions import IsOwner

class ReviewsListCreateAPIView(viewsets.ModelViewSet):
    serializer_class = ReviewsSerializer
    queryset = Reviews.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)