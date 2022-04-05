# imports
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views



# End: imports -----------------------------------------------------------------

app_name = 'appointments'  # Necessary for url naming. eg {% url 'appointments:create' %}

urlpatterns = [
    path('create/', view=views.AppointmentCreateView.as_view(), name="create"),

]
