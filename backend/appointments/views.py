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

from .models import Appointment
from .serializer import AppointmentCreateSerializer, AppointmentSerializer, HostRetailerSerializer
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

        if user != appointment.retailer.organizer:
            appointment.retailer.retailer_participants.add(user)
            
        
        company_serializer = correct_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        appointment = Appointment.objects.filter(appointment_type=Appointment.AppointmentType.TRADESHOW).first()

        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data,
            'appointment': AppointmentSerializer(appointment).data
        })