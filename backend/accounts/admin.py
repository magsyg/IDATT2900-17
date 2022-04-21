from http.server import BaseHTTPRequestHandler
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
User = get_user_model()
# Register your models here.
@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone_number','profile_picture')}),
        ('Permissions', {
            'fields': ('is_admin',),
        }),
        ('Company', {
            'fields': ('company',),
        }),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_admin', )}
         ),
    )
    list_display = ('id','email', 'first_name', 'last_name', 'company', 'is_admin', )
    list_filter = ('is_admin',)
    search_fields = ('email', 'first_name', 'last_name','company__name')
    ordering = ('email',)
    filter_horizontal = ()
