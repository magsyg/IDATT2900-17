# imports
from email import message
from django.views import View
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponse, Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Brand, Company, Retailer
from .serializer import BrandSerializer, RetailerSerializer
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

