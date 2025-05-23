from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reviews import views

router = DefaultRouter()
router.register(r'', views.ReviewsListCreateAPIView, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
