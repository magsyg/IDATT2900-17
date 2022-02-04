# imports
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views
from . import forms as account_forms
# End: imports -----------------------------------------------------------------

app_name = 'accounts'  # Necessary for url naming. eg {% url 'accounts:signin' %}

urlpatterns = [
    path('login/', view=auth_views.LoginView.as_view(template_name='accounts/login.html', form_class=account_forms.CustomAuthenticationForm), name='login'),
    path('current_user/', view=views.CurrentUserView.as_view(), name="current_user")
]
