from rest_framework import serializers
from .models import Quiz, Question, Choice, UserAnswer

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()

    def validate(self, data):
        question_id = data['question_id']
        choice_id = data['choice_id']
        if not Choice.objects.filter(id=choice_id, question_id=question_id).exists():
            raise serializers.ValidationError("Choix invalide pour cette question.")
        return data

class BulkSubmitAnswerSerializer(serializers.Serializer):
    responses = SubmitAnswerSerializer(many=True)

class UserQuizScoreSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    score = serializers.FloatField()
    total = serializers.IntegerField()