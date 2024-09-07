# rsvp/views.py
from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import RSVP, Event
from .serializers import RSVPSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from events.serializers import EventSerializer

# RSVP creation and listing for the logged-in user
class RSVPListCreateView(generics.ListCreateAPIView):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]  # Ensure authenticated users can access

    def perform_create(self, serializer):
        # Allow user to create RSVP for their event, enforce event_id and user assignment
        if 'event_id' not in self.request.data or 'status' not in self.request.data:
            return Response({'detail': 'Missing event_id or status'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            event = Event.objects.get(id=self.request.data['event_id'])
            serializer.save(user=self.request.user, event=event)
        except Event.DoesNotExist:
            return Response({'detail': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


# Update, delete or view the RSVP details for the logged-in user
class RSVPDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Ensure that users can only access RSVPs they created
        return RSVP.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        # Ensure that the correct status is being passed
        instance = self.get_object()
        rsvp_status = request.data.get('status')
        
        if rsvp_status not in ['attending', 'not attending', 'maybe', 'cancelled']:
            return Response({'error': 'Invalid RSVP status'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the status field and save
        instance.status = rsvp_status
        instance.save()
        return Response({'message': 'RSVP updated successfully'}, status=status.HTTP_200_OK)


# Register a user for an event without assigning any RSVP status initially
class RegisterForEventView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = request.data.get('event_id')
        try:
            event = Event.objects.get(id=event_id)
            
            # Ensure the user is not already registered
            if RSVP.objects.filter(user=request.user, event=event).exists():
                return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

            # Register the user and set the RSVP status to 'attending'
            RSVP.objects.create(user=request.user, event=event, status='attending')
            return Response({'message': 'Successfully registered for event with default RSVP of attending'}, status=status.HTTP_201_CREATED)
        
        except Event.DoesNotExist:
            return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)


# List events the current user has registered for
class RegisteredEventsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        # Filter events that the current user has RSVP'd for
        return Event.objects.filter(rsvp__user=self.request.user)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        event_data = []
        
        for event in queryset:
            rsvp = RSVP.objects.get(event=event, user=request.user)
            event_data.append({
                'id': event.id,
                'title': event.title,
                'description': event.description,
                'date': event.date,
                'location': event.location,
                'created_by': event.created_by.id,
                'rsvp_status': rsvp.status  # Add RSVP status
            })
        
        return Response(event_data)
