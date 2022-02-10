from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, verbose_name="Name")
    # description = models.CharField(max_length=30, blank=False, null=False, verbose_name="Description")
    def get_correct_model(self):
        """Returns the extended model if any, either Brand or Retailer"""
        for sub in Company.__subclasses__():
            field = sub.__name__.lower()
            if hasattr(self, field):
                return getattr(self, field)
        return self

    def get_model_name(self):
        return self.get_correct_model().__class__.__name__
    def __str__(self):
        return f'{self.name} - {self.get_model_name()}'

class Brand(Company):
    products = models.CharField(max_length=30, blank=True, verbose_name="Name") #TODO add products

class Retailer(Company):
    brands = models.ManyToManyField('companies.Brand', null=True, related_name="retailers", blank=True, verbose_name="Partners")