from rest_framework import serializers
from django.contrib.auth.models import User 
from reviews.models import Reviews
from reviews.serializers import OnlyReviewsSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ('id', 'username', 'email', 'password')

        extra_kwargs = {
            'password': {'write_only':True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserDetailSerializer(serializers.ModelSerializer):

    reviews = OnlyReviewsSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'reviews')
