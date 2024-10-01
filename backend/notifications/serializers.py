# notifications/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    
    user = serializers.StringRelatedField(read_only=True)
    event = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'event', 'created_at']

    
    def update(self, instance, validated_data):
        
        request_user = self.context['request'].user
        if instance.user != request_user:
            raise serializers.ValidationError("You can only update your own notifications.")
        
        
        instance.is_read = validated_data.get('is_read', instance.is_read)
        instance.save()
        return instance
