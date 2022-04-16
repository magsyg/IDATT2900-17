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

        mod_path = Path(__file__).parent
        relative_path ='../../../placeholders/profile_pictures'
        placeholder_path = (mod_path / relative_path).resolve()
        profile_pictures = os.listdir(placeholder_path)

        fake = Faker()
        seeder = Seed.seeder()
        seeder.faker.seed_instance()

        seeder.add_entity(User, 30, {'profile_picture':None})

        seeder.add_entity(companies_models.Retailer, 8, {
            'name': lambda x: seeder.faker.word(),
        })

        seeder.add_entity(companies_models.Brand, 8, {
            'name': lambda x: seeder.faker.word(),
        })
        
        companies = companies_models.Company.objects.all()

        seeder.execute()


        retailers = companies_models.Retailer.objects.all()
        for brand in companies_models.Brand.objects.all():
            brand.retailers.set(random.choices(list(retailers), k=4))
        for user in User.objects.all():
            # Set random profile picture and company
            # TODO seeder should only set the seeded instances properties
            user.company = random.choice(list(companies))
            random_profile_picture = random.choice(profile_pictures)
            image_path = (placeholder_path / random_profile_picture).resolve()
            user.profile_picture = ImageFile(open(image_path, mode='rb'), name=random_profile_picture)
            user.save()


    def handle(self, *args, **options):

        interactive = options['interactive']
        if interactive:
            if not self.confirmation():
                print('== ABORT ==')
                return
        self.populate()

        # End of handle
