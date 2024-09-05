# rsvp/admin.py
from django.contrib import admin
from .models import RSVP

class RSVPAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'status')  # Fields to display in the list view
    list_filter = ('status',)  # Filter by RSVP status
    search_fields = ('user__username', 'event__title')  # Allow searching by username or event title

admin.site.register(RSVP, RSVPAdmin)
