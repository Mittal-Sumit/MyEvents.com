# backend/events/admin.py

from django.contrib import admin
from .models import Event

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'created_by')
    list_filter = ('date', 'created_by')
    search_fields = ('title', 'description', 'location', 'created_by__username')

admin.site.register(Event, EventAdmin)
