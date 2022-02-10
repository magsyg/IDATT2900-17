# imports
from django.urls import path


from . import views as company_views



# End: imports -----------------------------------------------------------------

app_name = 'companies'

urlpatterns = [
    path('brand/<int:pk>/', view=company_views.BrandDetail.as_view(), name="brand"),
    path('brand/create/', view=company_views.CreateBrand.as_view(), name="create_brand"),
    path('retailer/<int:pk>/', view=company_views.RetailerDetail.as_view(), name="retailer"),
    path('retailer/create/', view=company_views.CreateRetailer.as_view(), name="create_retailer"),
]
