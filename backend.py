from django.db import models
from rest_framework import serializers, viewsets
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.shortcuts import get_object_or_404

# Model
class Comment(models.Model):
    author = models.CharField(max_length=255)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    image = models.URLField(blank=True, null=True)

# Serializer
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

# ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-date')
    serializer_class = CommentSerializer

# Router
router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')

# URLs
urlpatterns = [
    path('api/', include(router.urls)),
]
