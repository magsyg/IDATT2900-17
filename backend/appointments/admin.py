from django.contrib import admin
from django.contrib.auth import get_user_model


from .models import Appointment, HostRetailer, ParticipatingBrand

User = get_user_model()
# Register your models here.
@admin.register(Appointment)
class AppointmentModelAdmin(admin.ModelAdmin):
    list_display = ['name','appointment_type','date','start_time']
    # list_filter = []
    search_fields = ['name','appointment_type','retailer','brands']
    ordering = ['id']
    # readonly_fields = []
    # filter_horizontal = []
    # actions = []

@admin.register(HostRetailer)
class HostRetailerModelAdmin(admin.ModelAdmin):
    list_display = ['retailer', 'organizer','hosted_appointment']
    # list_filter = []
    search_fields = ['retailer','organizer','hosted_appointment']
    ordering = ['id']
    # readonly_fields = []
    # filter_horizontal = []
    # actions = []


@admin.register(ParticipatingBrand)
class ParticipatingBrandModelAdmin(admin.ModelAdmin):
    list_display = ['appointment','brand','main_contact']

    search_fields = ['appointment','brand','main_contact']
    ordering = ['id']