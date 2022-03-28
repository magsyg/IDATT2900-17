from django.contrib import admin
from django.contrib.auth import get_user_model


from .models import Brand, Retailer, CompanyCode

User = get_user_model()
# Register your models here.
@admin.register(Retailer)
class RetailerModelAdmin(admin.ModelAdmin):
    list_display = ['name']
    # list_filter = []
    search_fields = ['name']
    ordering = ['id']
    # readonly_fields = []
    # filter_horizontal = []
    # actions = []
@admin.register(Brand)
class BrandModelAdmin(admin.ModelAdmin):
    list_display = ['name']
    # list_filter = []
    search_fields = ['name']
    ordering = ['id']
    # readonly_fields = []
    # filter_horizontal = []
    # actions = []


@admin.register(CompanyCode)
class CompanyCodeModelAdmin(admin.ModelAdmin):
    list_display = ['company','code']

    search_fields = ['name','code']
    ordering = ['id','company']

