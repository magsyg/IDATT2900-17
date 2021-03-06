# imports
from email import message
from logging import raiseExceptions
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse, HttpResponse, Http404
from django.core.exceptions import PermissionDenied


from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from .serializer import RegisterSerializer, UserSerializer
from companies.serializer import BrandSerializer, RetailerSerializer, correct_company_serializer
from appointments.serializer import SimpleAppointmentSerializer
from appointments.models import Appointment
from companies.models import CompanyCode
User = get_user_model()
# End: imports -----------------------------------------------------------------


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })
        

class CurrentUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        print(correct_company_serializer(request.user.company).__class__.__name__)
        return Response({
            'user':serializer.data,
            'company':correct_company_serializer(request.user.company).data,
            'company_type':request.user.company.get_correct_model().company_type
        })

class CalendarUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'user':serializer.data,
        })


class RegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.create()
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class UpdateProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def put(self, request, format=None):
        #TODO Find out about image upload
        serializer = self.serializer_class(request.user, data=request.data, context={'request': request}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class RegistrationNewCompanyView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        
        if 'company_code' in request.data:
            if CompanyCode.get_company_by_code(request.data["company_code"]):
                company = CompanyCode.get_company_by_code(request.data["company_code"])[1]
            else:  
                raise Http404("No company with matching code found")
        else:
            company_serializer_class = RetailerSerializer if int(request.data['teamType']) == 0 else BrandSerializer
            company_serializer = company_serializer_class(data=request.data, context={'request': request})

            company_serializer.is_valid(raise_exception=True)
        serializer.is_valid(raise_exception=True)

        user = serializer.create()
        
        if not 'company_code' in request.data:
            company = company_serializer.create()

        user.company = company
        user.save()

        if 'company_code' in request.data: # Delete code after successful registration
            CompanyCode.objects.get(code=request.data["company_code"], company=company).delete()

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })

class ProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id:int, format=None):
        profile_user = get_object_or_404(User, id=user_id)
        profile = UserSerializer(profile_user)

        return Response(profile.data)
