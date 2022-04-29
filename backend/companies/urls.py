# imports
from django.urls import path, re_path


from . import views as company_views



# End: imports -----------------------------------------------------------------

app_name = 'companies'

urlpatterns = [
    # General
    path('user/company/', view=company_views.GetUserCompany.as_view(), name="get_user_company"),
    path('update/', view=company_views.UpdateCompany.as_view(), name="update_company"),

    # Brands
    path('brand/<int:pk>/', view=company_views.BrandDetail.as_view(), name="brand"),
    path('brand/<int:pk>/profile/', view=company_views.BrandProfile.as_view(), name="brand_profile"),
    path('brand/requests/', view=company_views.BrandRequests.as_view(), name="brand_profile"),
    path('brand/create/', view=company_views.CreateBrand.as_view(), name="create_brand"),
    path('brands/', company_views.SearchBrandView.as_view()),

    # Retailers
    path('retailer/<int:pk>/', view=company_views.RetailerDetail.as_view(), name="retailer"),
    path('retailer/<int:pk>/profile/', view=company_views.RetailerProfile.as_view(), name="retailer_profile"),

    # Showroom
    path('showrooms/', view=company_views.Showrooms.as_view(), name="showrooms"),
    path('showrooms/<int:pk>/', view=company_views.Showroom.as_view(), name="showrooms"),
    path('showroom/create/', view=company_views.ShowroomCreate.as_view(), name="showroom_create"),
    # Retailers
    path('retailer/<int:pk>/', view=company_views.RetailerDetail.as_view(), name="retailer"),
    path('retailer/create/', view=company_views.CreateRetailer.as_view(), name="create_retailer"),

    # Codes

    path('company/codes/', view=company_views.CompanyCodesView.as_view(), name="get_company_codes"),
    path('code/', view=company_views.GetCompanyWithCode.as_view(), name="get_company_with_code"),

    # Notes
    path('<int:pk>/notes/', view=company_views.CompanyNotes.as_view(), name="company_notes"),
]
