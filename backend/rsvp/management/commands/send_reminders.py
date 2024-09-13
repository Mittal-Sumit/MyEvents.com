from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.utils import timezone
from rsvp.models import Event, RSVP  # Import your models
from datetime import timedelta

class Command(BaseCommand):
    help = 'Send event reminders to users'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        # Get events happening in the next 24 hours
        upcoming_events = Event.objects.filter(date__lte=now + timedelta(days=1), date__gte=now)

        for event in upcoming_events:
            rsvps = RSVP.objects.filter(event=event)
            for rsvp in rsvps:
                self.send_reminder_email(rsvp.user.email, event)

    def send_reminder_email(self, email, event):
        subject = f"Reminder: Upcoming Event '{event.title}'"
        message = f"Dear User,\n\nThis is a reminder for the upcoming event '{event.title}' happening on {event.date}. \n\nLocation: {event.location}\n\nPlease RSVP if you haven't done so."
        send_mail(subject, message, 'your_email@gmail.com', [email], fail_silently=False)
