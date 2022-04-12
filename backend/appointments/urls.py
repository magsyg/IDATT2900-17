# imports
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views



# End: imports -----------------------------------------------------------------

app_name = 'appointments'  # Necessary for url naming. eg {% url 'appointments:create' %}

urlpatterns = [
    path('create/', view=views.AppointmentCreateView.as_view(), name="create"),
    path('user/', view=views.AppointmentUserListView.as_view(), name="user_list"),
    path('<int:pk>/retailer/invite/', view=views.AppointmentInviteRetailParticipantView.as_view(), name="invite_retailer_participant"),
    
    # Tradeshow and Other
    path('<int:pk>/', view=views.AppointmentView.as_view(), name="get_appointment"),
    path('<int:pk>/brand/<int:brand_id>/', view=views.TradeShowBrandView.as_view(), name="tradeshow_brand"),
    path('brand/invite/', view=views.AppointmentBrandInvite.as_view(), name="invite_brand"),
    # Showroom
    path('showroom/<int:pk>/', view=views.ShowroomView.as_view(), name="showroom"),
]
