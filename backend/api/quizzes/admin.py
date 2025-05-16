from django.contrib import admin

# Register your models here.

from .models import Quiz, Question, Choice, UserAnswer

class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'game')
    inlines = [QuestionInline]

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'quiz')
    inlines = [ChoiceInline]

@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'question', 'choice', 'is_correct', 'answered_at')

    def is_correct(self, obj):
        return obj.is_correct()
    is_correct.boolean = True