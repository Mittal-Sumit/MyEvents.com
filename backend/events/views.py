# backend/events/views.py

from rest_framework import generics,filters
from .models import Event
from .serializers import EventSerializer
from django_filters.rest_framework import DjangoFilterBackend

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['title', 'date', 'location']  # Specify fields you want to filter by
    search_fields = ['title', 'description']  # Specify fields you want to search in
    ordering_fields = ['date']  # Specify fields you can order by

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class EventRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
