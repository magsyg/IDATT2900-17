# imports
from logging import raiseExceptions
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse, HttpResponse, Http404
from django.core.exceptions import PermissionDenied, FieldError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication

from .models import Appointment, ParticipatingBrand
from companies.models import Brand
from .serializer import AppointmentCreateSerializer, ParticipatingBrandCreateSerializer, SimpleAppointmentSerializer, AppointmentSerializer, HostRetailerSerializer, ParticipatingBrandSerializer
from companies.serializer import correct_serializer
from accounts.serializer import UserSerializer

User = get_user_model()

# Create your views here.
class AppointmentCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get(self, request, format=None):
        company_serializer = correct_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)

        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data
        })

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        appointment = serializer.create()


        return Response(appointment.data)


class AppointmentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        company_serializer = correct_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        appointment = Appointment.objects.filter(appointment_type=Appointment.AppointmentType.TRADESHOW).first()

        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data,
            'appointment': AppointmentSerializer(appointment).data
        })

class AppointmentInviteRetailParticipantView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        appointment = get_object_or_404(Appointment, id=pk)
        if request.user not in appointment.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite to an event you are not a part of')
        if 'user_id' not in request.data:
            raise FieldError('user_id not in request')
        user = get_object_or_404(User, id=request.data['user_id'])
        if user not in appointment.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite an outside member to this event')

        print(len(AppointmentSerializer(appointment).data['retailer']['retailer_participants']))
        if user != appointment.retailer.organizer:
            appointment.retailer.retailer_participants.add(user)
            
        retailer_participants = AppointmentSerializer(appointment).data['retailer']['retailer_participants']
        print(len(retailer_participants))

        return Response({
            'retailer_participants':retailer_participants
        })

class TradeShowBrandView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, tradeshow_id, brand_id, format=None):
        brand = get_object_or_404(Brand, id=brand_id)
        tradeshow = get_object_or_404(Appointment, id=tradeshow_id)
        if request.user not in tradeshow.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite to an event you are not a part of')
        if tradeshow.appointment_type != Appointment.AppointmentType.TRADESHOW:
            return Http404('No tradeshow with this ID')
        if brand not in tradeshow.brands.all():
            return Http404('Brand not a part of this tradeshow')

        company_serializer = correct_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        brand = get_object_or_404(ParticipatingBrand, brand=brand, appointment=tradeshow)
        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data,
            'brand': ParticipatingBrandSerializer(brand).data,
            'appointment': SimpleAppointmentSerializer(tradeshow).data
        })

class AppointmentBrandInvite(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ParticipatingBrandCreateSerializer

    def post(self, request, format=None):
        appointment = get_object_or_404(Appointment, id=request.data['appointment'])
        if request.user not in appointment.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite to an event you are not a part of')
        brand = get_object_or_404(Brand, id=request.data['brand'])
        if brand in appointment.brands.all():
            return Response('Brand already participating')
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        brand = serializer.create()
        return Response({
            'brand': ParticipatingBrandSerializer(brand).data
        })


class ShowroomView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        showroom_id = Appointment.objects.filter(appointment_type=Appointment.AppointmentType.SHOWROOM).first().id #TODO REMOVE
        showroom = get_object_or_404(Appointment, id=showroom_id)
        if request.user not in showroom.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite to an event you are not a part of')
        if showroom.appointment_type != Appointment.AppointmentType.SHOWROOM:
            return Http404('No showroom with this ID')

        company_serializer = correct_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        brand = get_object_or_404(ParticipatingBrand, brand=showroom.brands.first(), appointment=showroom)
        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data,
            'brand': ParticipatingBrandSerializer(brand).data,
            'appointment': AppointmentSerializer(showroom).data
        })