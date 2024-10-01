# notifications/scheduler.py
import boto3
import json
from django.utils import timezone
from datetime import timedelta
from rsvp.models import Event, RSVP

def send_event_reminders():
    now = timezone.now()
    exactly_24_hours_later = now + timedelta(hours=24)

    # Get events happening in the next 24 hours
    upcoming_events = Event.objects.filter(date__gte=exactly_24_hours_later, date__lt=exactly_24_hours_later + timedelta(minutes=1))

    # Create Lambda client
    lambda_client = boto3.client('lambda', region_name='ap-south-1')

    for event in upcoming_events:
        rsvps = RSVP.objects.filter(event=event)
        email_recipients = [rsvp.user.email for rsvp in rsvps]

        if email_recipients:
            # Prepare payload for Lambda function
            payload = {
                'email_recipients': email_recipients,
                'event_title': event.title,
                'event_date': str(event.date),
                'event_location': event.location,
            }

            try:
                # Invoke Lambda function
                response = lambda_client.invoke(
                    FunctionName='event_reminder_email',
                    InvocationType='Event',
                    Payload=json.dumps(payload),
                )
                print(f"Lambda invoked successfully: {response}")

            except Exception as e:
                print(f"Failed to invoke Lambda function: {str(e)}")

def start_scheduler():
    from apscheduler.schedulers.background import BackgroundScheduler
    from notifications.tasks import send_event_reminders  # Lazy import here
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_event_reminders, 'interval', minutes=1)
    scheduler.start()
