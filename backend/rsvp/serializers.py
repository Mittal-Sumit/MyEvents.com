# rsvp/serializers.py
from rest_framework import serializers
from .models import RSVP

class RSVPSerializer(serializers.ModelSerializer):
    class Meta:
        model = RSVP
        fields = ['id', 'event', 'user', 'status']
        read_only_fields = ['user']  # Ensure the user is set automatically

    def create(self, validated_data):
        event = validated_data.get('event')
        user = self.context['request'].user
        status = validated_data.get('status')
        # Ensure that RSVP status is set correctly
        return RSVP.objects.create(event=event, user=user, status=status)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
