# backend/events/views.py

from rest_framework import generics, filters, permissions
from .models import Event
from .serializers import EventSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['title', 'date', 'location']  
    search_fields = ['title', 'description']  
    ordering_fields = ['date']  

    def get_permissions(self):
        """
        Only admins can create events. Anyone can view the list of events.
        """
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        # Save the event with the user who created it
        serializer.save(created_by=self.request.user)


class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        """
        Managers and Admins can update or delete events, and everyone can retrieve (view) events.
        """
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def check_object_permissions(self, request, obj):
        """
        Ensure that only Managers or Admins can update or delete events.
        """
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            if not request.user.role in ['admin', 'manager']:
                raise PermissionDenied("You do not have permission to edit or delete this event.")
        super().check_object_permissions(request, obj)
