from django.contrib import admin

# Register your models here.

from reviews.models import Reviews

@admin.register(Reviews)
class GameAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'rating', 'comment')

