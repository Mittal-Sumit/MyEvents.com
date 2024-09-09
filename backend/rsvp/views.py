from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from .models import RSVP, Event, GuestList
from .serializers import RSVPSerializer, GuestListSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from events.serializers import EventSerializer


# RSVP creation and listing for the logged-in user
class RSVPListCreateView(generics.ListCreateAPIView):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Create RSVP and automatically add to GuestList
        event = get_object_or_404(Event, id=self.request.data['event_id'])
        rsvp_status = serializer.validated_data.get('status', 'attending')
        user = self.request.user

        # Save RSVP
        rsvp = serializer.save(user=user, event=event)

        # Add user to GuestList if not already present
        guest, created = GuestList.objects.get_or_create(
            user=user,
            event=event,
            defaults={'guest_name': user.username, 'email': user.email, 'status': rsvp_status}
        )

        if not created:
            # Update guest status if already exists
            guest.status = rsvp_status
            guest.save()


# Update, delete, or view RSVP details for the logged-in user
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

        # Update the RSVP status and save
        instance.status = rsvp_status
        instance.save()

        # Update the corresponding GuestList entry
        guest = GuestList.objects.filter(user=instance.user, event=instance.event).first()
        if guest:
            guest.status = rsvp_status
            guest.save()

        return Response({'message': 'RSVP and GuestList updated successfully'}, status=status.HTTP_200_OK)


# Register a user for an event without assigning any RSVP status initially
class RegisterForEventView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = request.data.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        user = request.user

        # Ensure the user is not already registered
        if RSVP.objects.filter(user=user, event=event).exists():
            return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        # Register the user and set the RSVP status to 'attending'
        rsvp = RSVP.objects.create(user=user, event=event, status='attending')

        # Automatically add the user to GuestList
        GuestList.objects.create(
            user=user,
            event=event,
            guest_name=user.username,  # Using the username as the guest name
            email=user.email,
            status='attending'  # Default status
        )

        return Response({'message': 'Successfully registered for event with default RSVP of attending'}, status=status.HTTP_201_CREATED)


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


# View for listing all guests for an event
class GuestListView(generics.ListCreateAPIView):
    queryset = GuestList.objects.all()
    serializer_class = GuestListSerializer
    permission_classes = [IsAdminUser]  # Only admins can access the guest list

    def get_queryset(self):
        # Allow filtering by event ID
        event_id = self.request.query_params.get('event_id')
        if event_id:
            return GuestList.objects.filter(event_id=event_id)
        return GuestList.objects.all()


# View for retrieving, updating, and deleting individual guests
class GuestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GuestList.objects.all()
    serializer_class = GuestListSerializer
    permission_classes = [IsAdminUser]  # Only admins can manage guests
