from django.urls import path
from users import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('me/', views.me, name='me'),
    path('<int:pk>/', views.get_user, name='user-detail'),
]
