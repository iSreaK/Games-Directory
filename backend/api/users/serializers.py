from rest_framework import serializers
from django.contrib.auth.models import User
from reviews.serializers import ReviewsSerializer

class UserSerializer(serializers.ModelSerializer):
    reviews = ReviewsSerializer(many=True, read_only=True)
    class Meta(object):
        model = User
        fields = ('id', 'username', 'email', 'password', 'reviews')

        extra_kwargs = {
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    reviews = ReviewsSerializer(many=True, read_only=True)

    class Meta(object):
        model = User
        fields = ('id', 'username', 'reviews')