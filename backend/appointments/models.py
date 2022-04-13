import datetime
from django.db import models
from django.utils import timezone
from django.db.models import Q
from django.db.models.query import QuerySet

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
    retailer = models.ForeignKey('appointments.HostRetailer', related_name='hosted_appointment', null=False, on_delete=models.CASCADE,
    verbose_name='Retailer')
    brands = models.ManyToManyField(Brand, through='appointments.ParticipatingBrand', related_name='participated_appointments', verbose_name='Brands')
    
    # scheduling information
    date = models.DateField(null=False, blank=False, verbose_name='Date')
    start_time = models.TimeField(null=False, blank=False, verbose_name='Start time')
    end_time = models.TimeField(null=False, blank=False, verbose_name='End time')
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
        return participating_appointments.distinct().order_by('date','start_time')

    @staticmethod
    def get_available_times(users: QuerySet, date: datetime = timezone.now(), days: int = 16):
        availability = list()
        work_hours = Appointment.get_workhours()
        for i in range(days):
            users_work_hours = work_hours.copy()
            for user in users:
                for appointment in Appointment.get_user_appointments(user=user,date=date):
                    for hour in work_hours:
                        print(appointment.end_time, hour, appointment.start_time, appointment.end_time > hour  >= appointment.start_time)
                        if hour in users_work_hours and appointment.end_time > hour  >= appointment.start_time:
                            users_work_hours.remove(hour)

            if date.date() == timezone.now().date(): # Method for not displayin passed times
                for ii in range(len(users_work_hours)):
                    if timezone.now().time() < users_work_hours[ii]: 
                        users_work_hours = users_work_hours[ii:]
                        break
            availability.append(
                {
                'date':date.date(),
                'hours':users_work_hours
                }
            )
            date+=timezone.timedelta(days=1)
        return availability
                        



            
    @staticmethod 
    def get_workhours():
        #TODO Move this to some kind of utils file
        time = timezone.now().replace(hour=9, minute=0, second=0, microsecond=0) # Use timezone, because this is timezone aware, may be dumb
        workhours = list()
        while time <= timezone.now().replace(hour=17, minute=0, second=0, microsecond=0):
            workhours.append(time.time())
            time += timezone.timedelta(minutes=30)
        return workhours

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