from django.contrib import admin
from django.contrib.auth import get_user_model


from .models import Brand, BrandRetailerRelation, Retailer, CompanyCode, Note, ShowRoom

User = get_user_model()
# Register your models here.
@admin.register(Retailer)
class RetailerModelAdmin(admin.ModelAdmin):
    list_display = ['id','name']
    # list_filter = []
    search_fields = ['name']
    ordering = ['id']
    # readonly_fields = []
    # filter_horizontal = []
    # actions = []
@admin.register(Brand)
class BrandModelAdmin(admin.ModelAdmin):
    list_display = ['id','name']
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


@admin.register(BrandRetailerRelation)
class BrandRetailerRelationAdmin(admin.ModelAdmin):
    list_display = ['brand','retailer']

    search_fields = ['brand','retailer']
    ordering = ['id', 'brand','retailer']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['company', 'creator','timestamp']    
    search_fields = ['company', 'creator']
    ordering = ['id','timestamp']  


@admin.register(ShowRoom)
class ShowRoomAdmin(admin.ModelAdmin):
    list_display = ['brand', 'address','city','country']    
    search_fields = ['brand', 'address','city','country']   
    ordering = ['id']  