import datetime
from django.db import models
from django.utils import timezone
from django.db.models import Q
from companies.models import Retailer, Brand
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class Appointment(models.Model):
    class AppointmentType(models.TextChoices):
        SHOWROOM = 'SR', 'Showroom'
        TRADESHOW = 'TS', 'Trade Show'
        OTHER = 'OT', 'Other'

    name = models.CharField(null=False, blank=False, max_length=30, verbose_name='Name')
    appointment_type = models.CharField(max_length=2, choices=AppointmentType.choices, default=AppointmentType.OTHER, blank=False, null=False, verbose_name="Appointment Type")

    # participants
    retailer = models.ForeignKey('appointments.HostRetailer', related_name='hosted_appointments', null=False, on_delete=models.CASCADE,
    verbose_name='Retailer')
    brands = models.ManyToManyField(Brand, through='appointments.ParticipatingBrand', related_name='participated_appointments', verbose_name='Brands')
    
    # scheduling information
    date = models.DateField(null=False, blank=False, verbose_name='Date')
    time = models.TimeField(null=False, blank=False, verbose_name='Time')
    #TODO add address

    other_information = models.TextField(null=True, blank=True, max_length=200, verbose_name='Other information')


    """
        Tradeshow
        -name
        address

        Runway
        - address
        - doorcode
        - floor
        - note?
        invited too


        Other
        address
        door code
        floor
        showroom
        - brand
        - address
    """
    @staticmethod
    def get_user_appointments(user: User, date: datetime = timezone.now(), month: bool = False):
        # TODO add params for upcomming, and specific dates
        participating_appointments = Appointment.objects.filter(
            Q(retailer__organizer=user)|
            Q(retailer__retailer_participants=user))
        
        # Filtering by date:
        participating_appointments = participating_appointments.filter(date__year=date.year, date__month=date.month)
        if not month:
            participating_appointments = participating_appointments.filter(date__day=date.day)
        return participating_appointments.distinct().order_by('date','time')

class HostRetailer(models.Model):
    retailer = models.ForeignKey(Retailer, blank=False, null=False, on_delete=models.CASCADE)
    retailer_participants = models.ManyToManyField(User, related_name="retailer_appointments")
    organizer = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="hosted_appointments")

    def all_participants(self):
        return self.organizer | self.retailer_participants

    def save(self, *args, **kwargs):
        #TODO add method for not adding participants that are not of retailer
        super().save(*args, **kwargs)
    
class ParticipatingBrand(models.Model):
    appointment = models.ForeignKey(Appointment, blank=False, null=False, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, blank=False, null=False, on_delete=models.CASCADE)
    brand_participants = models.ManyToManyField(User, related_name="brand_appointments")
    main_contact = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name="contact_appointments")

    def all_participants(self):
        return self.main_contact | self.brand_participants

    def save(self, *args, **kwargs):
        #TODO add method for not adding participants that are not of brand
        super().save(*args, **kwargs)