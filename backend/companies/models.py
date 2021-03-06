
from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError

from django.contrib.auth import get_user_model

User = get_user_model()

class Company(models.Model):
    bio = models.TextField(max_length=200, blank=True, null=True, verbose_name="Bio")
    homepage = models.URLField(blank=True, null=True, verbose_name="Homepage")
    logo = models.ImageField(null=True, blank=True, upload_to ='company_logos/', verbose_name="Company Logo")
    
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
        return f'{self.get_correct_model().name} - {self.get_model_name()}'

class Brand(Company):
    company_type = "BRAND"
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, verbose_name="Name")
    #products = models.CharField(max_length=30, blank=True, verbose_name="Name") #TODO add products'

    #TODO add validation to select only your own showrooms
    current_showroom = models.ForeignKey('companies.Showroom', null=True, blank=False, related_name="current_brand", on_delete=models.SET_NULL, verbose_name="Current showroom")
class Retailer(Company):
    company_type = "RETAILER"
    name = models.CharField(max_length=30, unique=True, blank=False, null=False, verbose_name="Name")
    brands = models.ManyToManyField(Brand, through='companies.BrandRetailerRelation', related_name='retailers', null=True, blank=True, verbose_name='Brands')

class CompanyCode(models.Model):
    company = models.ForeignKey(Company, related_name="codes", blank=False, null=False, on_delete=models.CASCADE)
    code = models.CharField(max_length=8)

    def save(self, *args, **kwargs):
        """
            Saves object, if it has no code, create new unique code.
        """
        if not self.code or len(self.code) != 8:
            new_code = get_random_string(length=8)
            while new_code in CompanyCode.objects.all().values_list("code", flat=True):
                new_code = get_random_string(length=10)
            self.code = new_code
        super().save(*args, **kwargs)
    
    @staticmethod
    def get_company_by_code(find_code):
        """
            Fetches first company base on code,
            If code is found, returns code id and company
            if no matching company is found, return None
        """
        codes = CompanyCode.objects.filter(code=find_code)
        if codes:
            return (codes.first().id, codes.first().company.get_correct_model())
        return None

class Note(models.Model):
    creator = models.ForeignKey(User, blank=False, null=False, on_delete=models.CASCADE, verbose_name="Author")
    timestamp = models.DateTimeField(default=timezone.now, null=False, blank=False, verbose_name="Timestamp")

    company = models.ForeignKey(Company, blank=False, null=False, on_delete=models.CASCADE, verbose_name="Of company")
    text = models.TextField(max_length=200, null=False, blank=False, verbose_name="Note")


class BrandRetailerRelation(models.Model):
    brand = models.ForeignKey(Brand, related_name="retailer_relation", blank=False, null=False, on_delete=models.CASCADE)
    retailer = models.ForeignKey(Retailer, related_name="brand_relation", blank=False, null=False, on_delete=models.CASCADE)
    
    # Should have contact person for each company

class ShowRoom(models.Model):
    brand = models.ForeignKey(Company, null=False, blank=False, on_delete=models.CASCADE, related_name="showrooms", verbose_name="Brand")

    doorcode = models.CharField(max_length=10, null=True, blank=True, verbose_name="Door code")
    floor = models.CharField(max_length=10, null=True, blank=True, verbose_name="Floor")

    # Location info
    address = models.CharField(max_length=100, null=False, blank=False, verbose_name="Address")
    city = models.CharField(max_length=100, null=False, blank=False, verbose_name="City")
    country = models.CharField(max_length=100, null=False, blank=False, verbose_name="Country")

    # Hours
    hours_start = models.TimeField(null=False, blank=False, verbose_name="Start hours")
    hours_end = models.TimeField(null=False, blank=False, verbose_name="End hours")

    date_range_start = models.DateField(null=False, blank=False, verbose_name="Date range start")
    date_range_end = models.DateField(null=False, blank=False, verbose_name="Date rang end")
    
    def __str__(self):
        return f'{self.address} {self.city}'

    def clean(self):
        cleaned_data = super().clean()
        errors = {}
        if self.brand.get_correct_model().company_type != Brand.company_type:
            errors['brand'] = 'Company is not of type brand'
        if self.doorcode and not self.doorcode.isnumeric():
            errors['doorcode'] = "Door code is not numeric"
        if self.date_range_start > self.date_range_end:
            errors['date_range_start'] = 'Start date can not be after end date'
        if self.hours_start > self.hours_end:
            errors['hours_start'] = 'Start time can not be after end time'
        if errors:
            raise ValidationError(errors)

    def is_current(self):
        return self.brand.get_correct_model().current_showroom == self