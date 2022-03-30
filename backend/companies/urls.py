# imports
from django.urls import path


from . import views as company_views



# End: imports -----------------------------------------------------------------

app_name = 'companies'

urlpatterns = [
    path('user/company/', view=company_views.GetUserCompany.as_view(), name="get_user_company"),
    path('brand/<int:pk>/', view=company_views.BrandDetail.as_view(), name="brand"),
    path('brand/create/', view=company_views.CreateBrand.as_view(), name="create_brand"),
    path('retailer/<int:pk>/', view=company_views.RetailerDetail.as_view(), name="retailer"),
    path('retailer/create/', view=company_views.CreateRetailer.as_view(), name="create_retailer"),
    path('code/', view=company_views.GetCompanyWithCode.as_view(), name="get_company_with_code"),
]
