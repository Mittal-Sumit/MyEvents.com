# rsvp/models.py
from django.db import models
from django.conf import settings
from events.models import Event  # Importing the Event model

class RSVP(models.Model):
    ATTENDING = 'attending'
    NOT_ATTENDING = 'not attending'
    MAYBE = 'maybe'
    CANCELLED = 'cancelled'

    STATUS_CHOICES = [
        (ATTENDING, 'Attending'),
        (NOT_ATTENDING, 'Not Attending'),
        (MAYBE, 'Maybe'),
        (CANCELLED, 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, null=True, blank=True)  # Optional status

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.username} - {self.event.title} - {self.get_status_display() if self.status else 'No RSVP'}"
