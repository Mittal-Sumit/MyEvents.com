# notifications/scheduler.py

def start_scheduler():
    from apscheduler.schedulers.background import BackgroundScheduler
    from notifications.tasks import send_event_reminders  # Lazy import here
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_event_reminders, 'interval', minutes=1)
    scheduler.start()
