# imports
import random

from django_seed import Seed
from faker import Faker

from django.utils import timezone
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth import models as auth_models
from companies import models as companies_models
from appointments import models as appointments_models
# End: imports -----------------------------------------------------------------

# Settings:

User = get_user_model()


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '--noinput',
            '--no-input',
            action='store_false',
            dest='interactive',
            help='Tells Django to NOT prompt the user for input of any kind.',
        )

    def confirmation(self):
        answer = None
        yes = ['yes', 'y']
        no = ['no', 'n']
        print('== This command will:')
        print('\t 1. Attempt to seed all models')

        print('\n== Are you sure? DOUBLE-CHECK that this is not production server ==')

        while answer not in yes + no:
            answer = input("Type 'y' or 'n': ").lower()

        return answer in yes

    def populate(self): 
        fake = Faker()
    
        retailers = companies_models.Retailer.objects.all()
        brands = companies_models.Brand.objects.all()

        time_list = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','14:00','15:00','16:00','17:00']
        for i in range(100):
            random_retailer = random.choice(list(retailers))
            host_retailer = appointments_models.HostRetailer.objects.create(
                retailer = random_retailer,
                organizer = random.choice(list(random_retailer.members.all()))
            )
            time_id = random.choice(range(len(time_list)-1))
            random_day = random.choice(range(8))
            print(appointments_models.Appointment.AppointmentType.values)
            appointment = appointments_models.Appointment.objects.create(
                name=fake.word(),
                retailer=host_retailer,
                appointment_type=random.choice(appointments_models.Appointment.AppointmentType.values),
                start_time=time_list[time_id],
                end_time=time_list[time_id+1],
                date=(timezone.now()+timezone.timedelta(days=random_day)).date(),
                other_information=fake.text(),
            )
            random_brand = random.choice(list(brands))
            appointments_models.ParticipatingBrand.objects.create(
                brand=random_brand,
                main_contact=random.choice(list(random_brand.members.all())),
                appointment=appointment,
            )

    def handle(self, *args, **options):

        interactive = options['interactive']
        if interactive:
            if not self.confirmation():
                print('== ABORT ==')
                return
        self.populate()

        # End of handle
