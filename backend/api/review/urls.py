from django.urls import path, include
from rest_framework.routers import DefaultRouter
from review import views

router = DefaultRouter()
router.register(r'allgames', views.GameListAPIView, basename='allgames')
router.register(r'review', views.ReviewListCreateAPIView, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
