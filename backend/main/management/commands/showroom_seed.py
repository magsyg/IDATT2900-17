# imports
import os
from pathlib import Path
import random
from time import timezone
from django_seed import Seed
from faker import Faker
from PIL import Image

from django.core.files.images import ImageFile
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
        # Use after myseed
        fake = Faker()
        seeder = Seed.seeder()
        seeder.faker.seed_instance()

        total_showrooms=len(companies_models.Brand.objects.filter(showrooms=None))
        if total_showrooms > 0:
            seeder.add_entity(companies_models.ShowRoom, total_showrooms, {
                'brand': lambda x: companies_models.Brand.objects.filter(showrooms=None).first()
            })

            seeder.execute()

        for brand in companies_models.Brand.objects.filter(current_showroom=None):
            brand.current_showroom = brand.showrooms.first()
            brand.save()


    def handle(self, *args, **options):

        interactive = options['interactive']
        if interactive:
            if not self.confirmation():
                print('== ABORT ==')
                return
        self.populate()

        # End of handle
