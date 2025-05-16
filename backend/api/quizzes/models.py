from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from games.models import Game

class Quiz(models.Model):
    game = models.OneToOneField(Game, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} ({self.game.name})"

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'✔' if self.is_correct else '✘'})"

class UserAnswer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    answered_at = models.DateTimeField(auto_now_add=True)

    def is_correct(self):
        return self.choice.is_correct