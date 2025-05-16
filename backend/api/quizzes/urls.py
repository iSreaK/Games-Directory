from django.urls import path
from .views import QuizByGameView, SubmitAnswerView, UserQuizScoreView, SubmitQuizView, UserAllQuizScoresView

urlpatterns = [
    path('game/<int:game_id>/', QuizByGameView.as_view(), name='quiz-by-game'),
    path('submit/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('<int:quiz_id>/score/', UserQuizScoreView.as_view(), name='user-score'),
    path('score/all', UserAllQuizScoresView.as_view(), name='user-score'),
    path('submit-quiz/', SubmitQuizView.as_view(), name='submit-quiz')
]