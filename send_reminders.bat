@echo off
cd /d "C:\Users\susha\OneDrive\Desktop\MyEvent.com\backend"
call venv\Scripts\activate
python manage.py send_reminders
deactivate
