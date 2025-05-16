from django.urls import path, include
from rest_framework.routers import DefaultRouter
from games import views

router = DefaultRouter()
router.register(r'', views.GameListAPIView, basename='games')

urlpatterns = [
    path('', include(router.urls)),
]
