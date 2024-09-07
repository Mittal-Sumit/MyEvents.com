# backend/events/views.py

from rest_framework import generics,filters
from .models import Event
from .serializers import EventSerializer
from django_filters.rest_framework import DjangoFilterBackend

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['title', 'date', 'location']  
    search_fields = ['title', 'description']  
    ordering_fields = ['date']  

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

