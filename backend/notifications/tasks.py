# notifications/tasks.py

from django.core.mail import send_mail
from django.utils import timezone
from rsvp.models import Event, RSVP  # Importing your models from rsvp
from datetime import timedelta
from .models import Notification  # Importing the Notification model from the same app
import logging

logger = logging.getLogger(__name__)

def send_event_reminders():
    now = timezone.now()
    one_day_later = now + timedelta(days=1)
    exactly_24_hours_later = now + timedelta(hours=24)

    # Get events happening in the next 24 hours
    upcoming_events = Event.objects.filter(date__gte=exactly_24_hours_later, date__lt=exactly_24_hours_later + timedelta(minutes=1))

    for event in upcoming_events:
        rsvps = RSVP.objects.filter(event=event)
        for rsvp in rsvps:
            try:
                # Send reminder email
                send_reminder_email(rsvp.user.email, event)

                # Create a notification
                Notification.objects.create(
                    user=rsvp.user,
                    event=event,
                    message=f"Reminder: The event '{event.title}' is happening tomorrow at {event.date}. Don't miss it!"
                )

            except Exception as e:
                logger.error(f"Error sending reminder for event '{event.title}' to user '{rsvp.user.email}': {e}")

def send_reminder_email(email, event):
    subject = f"Reminder: Upcoming Event '{event.title}'"
    message = (
        f"Dear User,\n\nThis is a reminder for the upcoming event '{event.title}' happening on {event.date}. "
        f"\n\nLocation: {event.location}\n\nPlease RSVP if you haven't done so."
    )
    send_mail(subject, message, 'your_email@gmail.com', [email], fail_silently=False)
    logger.info(f"Reminder email sent to {email} for event '{event.title}'")
