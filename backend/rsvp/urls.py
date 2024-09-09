# rsvp/urls.py
from django.urls import path
from .views import RSVPListCreateView, RSVPDetailView, RegisterForEventView, RegisteredEventsView, GuestListView, GuestDetailView


urlpatterns = [
    path('rsvps/', RSVPListCreateView.as_view(), name='rsvp-list-create'),
    path('rsvps/<int:pk>/', RSVPDetailView.as_view(), name='rsvp-detail'),
    path('register/', RegisterForEventView.as_view(), name='register-event'),
    path('registered-events/', RegisteredEventsView.as_view(), name='registered-events'),
    path('guestlist/', GuestListView.as_view(), name='guestlist'),
    path('guestlist/<int:pk>/', GuestDetailView.as_view(), name='guest-detail'),
]
