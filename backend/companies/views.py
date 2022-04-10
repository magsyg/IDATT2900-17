# imports
from email import message
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse, HttpResponse, Http404

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication

from .models import Brand, Company, Retailer, CompanyCode
from .serializer import BrandSerializer, RetailerSerializer, correct_serializer

User = get_user_model()
# End: imports -----------------------------------------------------------------


class BrandDetail(APIView):
    authentication_classes = []
    permission_classes = []
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Brand.objects.get(pk=pk)
        except Brand.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        brand = self.get_object(pk)
        serializer = BrandSerializer(brand)
        return Response(serializer.data)
        

class RetailerDetail(APIView):
    authentication_classes = []
    permission_classes = []
    #authentication_classes = [TokenAuthentication]
    #permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Retailer.objects.get(pk=pk)
        except Retailer.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        retailer = self.get_object(pk)
        serializer = RetailerSerializer(retailer)
        return Response(serializer.data)


class CreateRetailer(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = RetailerSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        retailer = serializer.create()
        request.user.company = retailer
        request.user.save()

        return Response(self.serializer_class(retailer).data)


class CreateBrand(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BrandSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        brand = serializer.create()
        request.user.company = brand
        request.user.save()

        return Response(self.serializer_class(brand).data)

class GetCompanyWithCode(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        print(request.data)
        if "company_code" in request.data:
            if CompanyCode.get_company_by_code(request.data["company_code"]):
                company = CompanyCode.get_company_by_code(request.data["company_code"])[1]
                print(company, company.name)
                return Response({
                    'company_code': request.data['company_code'],
                    'company_name':company.name,
                    'company_id':company.id
                })
        raise Http404("No company with matching code found")


class GetUserCompany(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def get(self, request, format=None):
        company = request.user.company
        if not company:
            return Http404("User is not a part of any company")
        serializer = correct_serializer(company)
        return Response(serializer.data)


class CompanyCodesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        company = request.user.company
        if not company:
            raise Http404("User is not a part of any company")
        company = company.get_correct_model()
        return Response({
            'name': company.name,
            'codes': [code.code for code in company.codes.all()]
        })

    def post(self, request, format=None):
        company = request.user.company
        if not company:
            return Http404("User is not a part of any company")
        company = company.get_correct_model()
        CompanyCode.objects.create(company=company)

        return Response({
            'name': company.name,
            'codes': [code.code for code in company.codes.all()]
        })

    def delete(self, request, format=None):
        print("delete!!!!")
        company = request.user.company
        if not company:
            raise Http404("User is not a part of any company")
        company = company.get_correct_model()
        print("delete!!!!")
        print(request.data)
        if 'code' not in request.data:
            raise Http404("Code not sent")
        print("delete!!!!")
        code = get_object_or_404(CompanyCode, code=request.data['code'])
        print("delete!!!!")
        if code not in company.codes.all():
            raise PermissionDenied("Can not delete this code")
        code.delete()

        return Response({
            'name': company.name,
            'codes': [code.code for code in company.codes.all()]
        })

class SearchBrandView(generics.ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = BrandSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Brand.objects.all()
        name = self.request.query_params.get('name')
        if name is not None and len(name) != 0:
            queryset = queryset.filter(name__icontains=name)
        return queryset