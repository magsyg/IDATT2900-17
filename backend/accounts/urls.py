# imports
from django.urls import path
from django.contrib.auth import views as auth_views
from django.contrib.auth.forms import AuthenticationForm

from . import views
from . import forms as account_forms



# End: imports -----------------------------------------------------------------

app_name = 'accounts'  # Necessary for url naming. eg {% url 'accounts:signin' %}

urlpatterns = [
    path('current_user/', view=views.CurrentUserView.as_view(), name="current_user"),
    path('api-token-auth/', view=views.CustomAuthToken.as_view()),
    path('register/', view=views.RegistrationView.as_view()),
    path('register/newcompany', view=views.RegistrationNewCompanyView.as_view()),

    path('profile/update/', view=views.UpdateProfileView.as_view()),
]
