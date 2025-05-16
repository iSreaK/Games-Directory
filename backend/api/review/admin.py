from django.contrib import admin

# Register your models here.

from review.models import Game, Platform, Genre, Developer, Publisher, Review

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'genres_list', 'developers_list', 'publishers_list')
    def genres_list(self, obj):
        return ", ".join([genre.name for genre in obj.genres.all()])

    def developers_list(self, obj):
        return ", ".join([developer.name for developer in obj.developers.all()])

    def publishers_list(self, obj):
        return ", ".join([publisher.name for publisher in obj.publishers.all()])


@admin.register(Review)
class GameAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'rating', 'comment')

