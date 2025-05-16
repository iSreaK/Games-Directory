from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Quiz, UserAnswer, Question
from .serializers import QuizSerializer, SubmitAnswerSerializer, UserQuizScoreSerializer, BulkSubmitAnswerSerializer

class QuizByGameView(APIView):
    def get(self, request, game_id):
        try:
            quiz = Quiz.objects.get(game_id=game_id)
            serializer = QuizSerializer(quiz)
            return Response(serializer.data)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found."}, status=404)

class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmitAnswerSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            question_id = serializer.validated_data['question_id']
            choice_id = serializer.validated_data['choice_id']

            answer, created = UserAnswer.objects.update_or_create(
                user=user,
                question_id=question_id,
                defaults={'choice_id': choice_id}
            )
            return Response({
                "message": "Réponse enregistrée",
                "is_correct": answer.is_correct()
            })
        return Response(serializer.errors, status=400)
    
class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BulkSubmitAnswerSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            responses = serializer.validated_data['responses']
            score = 0

            for item in responses:
                question_id = item['question_id']
                choice_id = item['choice_id']

                # Crée ou met à jour la réponse
                user_answer, _ = UserAnswer.objects.update_or_create(
                    user=user,
                    question_id=question_id,
                    defaults={'choice_id': choice_id}
                )

                if user_answer.is_correct():
                    score += 1

            return Response({
                "message": "Réponses enregistrées",
                "score": score,
                "total": len(responses)
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserQuizScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        user = request.user
        questions = Question.objects.filter(quiz_id=quiz_id)
        total = questions.count()
        
        answered = UserAnswer.objects.filter(
            user=user,
            question__in=questions
        )

        if not answered.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        correct = answered.filter(choice__is_correct=True).count()

        return Response({
            "quiz_id": quiz_id,
            "score": correct,
            "total": total
        })
    
class UserAllQuizScoresView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        quiz_ids = UserAnswer.objects.filter(user=user).values_list('question__quiz_id', flat=True).distinct()

        results = []
        for quiz_id in quiz_ids:
            try:
                quiz = Quiz.objects.select_related('game').get(id=quiz_id)
            except Quiz.DoesNotExist:
                continue

            total = Question.objects.filter(quiz=quiz).count()
            correct = UserAnswer.objects.filter(
                user=user,
                question__quiz=quiz,
                choice__is_correct=True
            ).count()

            results.append({
                "quiz_id": quiz.id,
                "quiz_title": quiz.title,
                "game_id": quiz.game.id if quiz.game else None,
                "game_name": quiz.game.name if quiz.game else None,
                "score": correct,
                "total": total
            })

        return Response(results)