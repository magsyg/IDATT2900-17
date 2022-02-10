# imports
import random
from django_seed import Seed

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth import models as auth_models
from companies import models as companies_models
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
        seeder = Seed.seeder()
        seeder.faker.seed_instance()

        seeder.add_entity(User, 20)

        seeder.add_entity(companies_models.Retailer, 5, {
            'name': lambda x: seeder.faker.word(),
        })

        seeder.add_entity(companies_models.Brand, 5, {
            'name': lambda x: seeder.faker.word(),
        })
        
        companies = companies_models.Company.objects.all()

        _inserted_pks = seeder.execute()

        for user in User.objects.all():
            user.company = random.choice(list(companies))
            user.save()

        retailers = companies_models.Retailer.objects.all()
        for brand in companies_models.Brand.objects.all():
            brand.retailers.set(random.choices(list(retailers), k=4))

    def handle(self, *args, **options):

        interactive = options['interactive']
        if interactive:
            if not self.confirmation():
                print('== ABORT ==')
                return
        self.populate()

        # End of handle
