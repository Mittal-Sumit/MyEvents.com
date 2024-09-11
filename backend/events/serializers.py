# backend/events/serializers.py
from django.utils import timezone
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d %B %Y, %I:%M %p")  # Added custom format for date field

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('created_by',)

    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("The event date must be in the future.")
        return value
