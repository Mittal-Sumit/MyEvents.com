#rsvp/views.py
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from .models import RSVP, Event, GuestList
from .serializers import RSVPSerializer, GuestListSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from events.serializers import EventSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied



class RSVPListCreateView(generics.ListCreateAPIView):
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return RSVP.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        
        event = get_object_or_404(Event, id=self.request.data['event_id'])
        rsvp_status = serializer.validated_data.get('status', 'attending')
        user = self.request.user

        
        rsvp = serializer.save(user=user, event=event)

        
        guest, created = GuestList.objects.get_or_create(
            user=user,
            event=event,
            defaults={'guest_name': user.username, 'email': user.email, 'status': rsvp_status}
        )

        if not created:
            
            guest.status = rsvp_status
            guest.save()



class RSVPDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RSVP.objects.all()
    serializer_class = RSVPSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        
        rsvp = super().get_object()

        
        if rsvp.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this RSVP.")
        
        return rsvp

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        rsvp_status = request.data.get('status')

        if rsvp_status not in ['attending', 'not attending', 'maybe', 'cancelled']:
            return Response({'error': 'Invalid RSVP status'}, status=status.HTTP_400_BAD_REQUEST)

        
        instance.status = rsvp_status
        instance.save()

        
        guest = GuestList.objects.filter(user=instance.user, event=instance.event).first()
        if guest:
            guest.status = rsvp_status
            guest.save()

        return Response({'message': 'RSVP and GuestList updated successfully'}, status=status.HTTP_200_OK)



class RegisterForEventView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = request.data.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        user = request.user

        
        if RSVP.objects.filter(user=user, event=event).exists():
            return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        
        rsvp = RSVP.objects.create(user=user, event=event, status='attending')

        
        GuestList.objects.create(
            user=user,
            event=event,
            guest_name=user.username,  
            email=user.email,
            status='attending'  
        )

        return Response({'message': 'Successfully registered for event with default RSVP of attending'}, status=status.HTTP_201_CREATED)



class RegisteredEventsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventSerializer

    def get_queryset(self):
        
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
                'rsvp_status': rsvp.status 
            })

        return Response(event_data)



class GuestListView(generics.ListCreateAPIView):
    queryset = GuestList.objects.all()
    serializer_class = GuestListSerializer
    permission_classes = [IsAdminUser] 

    def get_queryset(self):
        
        event_id = self.request.query_params.get('event_id')
        if event_id:
            return GuestList.objects.filter(event_id=event_id)
        return GuestList.objects.all()



class GuestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GuestList.objects.all()
    serializer_class = GuestListSerializer
    permission_classes = [IsAdminUser]  

    def delete(self, request, *args, **kwargs):
        guest = self.get_object()

        try:
            rsvp = RSVP.objects.get(user=guest.user, event=guest.event)
            rsvp.delete()
            print(f"RSVP for user {guest.user} and event {guest.event} deleted.")
        except RSVP.DoesNotExist:
            print(f"No RSVP found for user {guest.user} and event {guest.event}.")

        
        guest.delete()

        return Response({"message": "Guest and RSVP deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class GuestListViewSet(viewsets.ModelViewSet):
    queryset = GuestList.objects.all()
    serializer_class = GuestListSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def mark_checked_in(self, request, pk=None):
        
        guest = self.get_object()
        guest.status = 'checked_in'
        guest.save()
        return Response({'message': 'Guest marked as checked in'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], permission_classes=[IsAdminUser])
    def delete_registration(self, request, pk=None):
        
        guest = self.get_object()
        guest.delete()
        return Response({'message': 'Guest registration deleted successfully'}, status=status.HTTP_200_OK)