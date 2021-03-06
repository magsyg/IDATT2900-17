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
    path('current_user/calendar', view=views.CalendarUserView.as_view(), name="current_user_calendar"),

    # Registration and authentication
    path('api-token-auth/', view=views.CustomAuthToken.as_view()),
    path('register/', view=views.RegistrationView.as_view()),
    path('register/newcompany', view=views.RegistrationNewCompanyView.as_view()),

    # Profile
    path('profile/<int:user_id>/', view=views.ProfileView.as_view(), name="profile"),
    path('profile/update/', view=views.UpdateProfileView.as_view(), name="update_profile"),
]
