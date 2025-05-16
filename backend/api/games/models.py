from django.db import models

# Create your models here.

class Platform(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Developer(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Publisher(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Game(models.Model):
    name = models.CharField(max_length=255)
    release_date = models.DateField(blank=True, null=True)
    background_image = models.URLField(blank=True, null=True)
    platforms = models.ManyToManyField(Platform, blank=True)
    genres = models.ManyToManyField(Genre, blank=True)
    developers = models.ManyToManyField(Developer, blank=True)
    publishers = models.ManyToManyField(Publisher, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name