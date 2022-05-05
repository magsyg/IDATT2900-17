# imports
from django.urls import path
from django.contrib.auth import views as auth_views

from . import views



# End: imports -----------------------------------------------------------------

app_name = 'appointments'  # Necessary for url naming. eg {% url 'appointments:create' %}

urlpatterns = [
    path('create/', view=views.AppointmentCreateView.as_view(), name="create"),
    path('availability/', view=views.AvailabilityView.as_view(), name="availability"),
    path('user/', view=views.AppointmentCurrentUserListView.as_view(), name="current_user_list"),
    path('users/<int:user_id>/', view=views.AppointmentUserListView.as_view(), name="user_list"),
    path('<int:pk>/retailer/invite/', view=views.AppointmentInviteRetailParticipantView.as_view(), name="invite_retailer_participant"),
    
    path('user/requests/', view=views.AppointmentRequests.as_view(), name="appointment_requests"),
    path('user/requests/<int:pk>/decline/', view=views.AppointmentRequestsDecline.as_view(), name="appointment_requests_decline"),
    path('user/requests/<int:pk>/accept/', view=views.AppointmentRequestsAccept.as_view(), name="appointment_requests_accept"),

    # Tradeshow and Other
    path('<int:pk>/', view=views.AppointmentView.as_view(), name="get_appointment"),
    path('<int:pk>/brand/<int:brand_id>/', view=views.TradeShowBrandView.as_view(), name="tradeshow_brand"),
    path('brand/invite/', view=views.AppointmentBrandInvite.as_view(), name="invite_brand"),
    # Showroom
    path('showroom/<int:pk>/', view=views.ShowroomView.as_view(), name="showroom"),

    
]
