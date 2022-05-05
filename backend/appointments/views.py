# imports
from logging import raiseExceptions
from django.utils import timezone
from django.views import View
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse, HttpResponse, Http404
from django.core.exceptions import PermissionDenied, FieldError,ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication

from .models import Appointment, ParticipatingBrand, HostRetailer
from companies.models import Brand
from .serializer import AppointmentCreateSerializer, ParticipatingBrandCreateSerializer, SimpleAppointmentSerializer, AppointmentSerializer, HostRetailerSerializer, ParticipatingBrandSerializer
from companies.serializer import correct_company_serializer
from accounts.serializer import UserSerializer

User = get_user_model()

# Create your views here.
class AppointmentCreateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentCreateSerializer

    def get(self, request, format=None):
        company_serializer = correct_company_serializer(request.user.company)
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

class AppointmentCurrentUserListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SimpleAppointmentSerializer

    def get(self, request, format=None):
        date = self.request.query_params.get('date')
        date = timezone.datetime.strptime(date,'%Y-%m-%d') if date else timezone.now()

        appointments = Appointment.get_user_appointments(user=request.user, date = date)
        print(appointments)
        return Response(self.serializer_class(appointments,many=True).data)

class AppointmentUserListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SimpleAppointmentSerializer

    def get(self, request, user_id, format=None):
        profile_user = get_object_or_404(User, id=user_id)
        if not profile_user in request.user.company.members.all(): # Have to be a member of company to view calendar
            raise PermissionDenied('You cant view this users appointments')

        date = self.request.query_params.get('date')
        date = timezone.datetime.strptime(date,'%Y-%m-%d') if date else timezone.now()

        appointments = Appointment.get_user_appointments(user=profile_user, date = date)
        print(appointments)
        return Response(self.serializer_class(appointments,many=True).data)

class AppointmentRequests(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = AppointmentSerializer

    def get(self, request, format=None):
        appointments = Appointment.get_requested_appointments(user=request.user)
        return Response(self.serializer_class(appointments,many=True).data)

class AppointmentRequestsDecline(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):
        appointment = get_object_or_404(Appointment, id=pk)
        if request.user not in appointment.brands.first().members.all():
            raise PermissionDenied('You cant delete this request')
        appointment.delete()
        return Response(True)

class AppointmentRequestsAccept(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = SimpleAppointmentSerializer

    def post(self, request, pk, format=None):
        appointment = get_object_or_404(Appointment, id=pk)
        if request.user not in appointment.brands.first().members.all():
            raise PermissionDenied('You cant accept this request')
        serializer = self.serializer_class(Appointment, data=request.data, context={'request': request}, partial=True)
        serializer.is_valid(raise_exception=True)
        if not  serializer.validated_data['date']:
            raise ValidationError("date not set")
        # Should be improved
        brand = appointment.participatingbrand_set.first()
        brand.main_contact = request.user        
        brand.save() 
        appointment.date = serializer.validated_data['date']
        appointment.start_time = serializer.validated_data['start_time']
        appointment.end_time = serializer.validated_data['end_time']
        appointment.is_request = False
        appointment.save()
        
        return Response(AppointmentSerializer(appointment).data)

class AvailabilityView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        users = User.objects.filter(id=request.user.id)
        print(users)
        availability = Appointment.get_available_times(users)
        print(availability)
        return Response(availability)

    def post(self, request, format=None):
        user_ids = [request.user.id]
        if 'users' in request.data:
            user_ids.extend(request.data['users'])
        users = User.objects.filter(id__in=user_ids)
        availability = Appointment.get_available_times(users)
        return Response(availability)

class AppointmentView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        company_serializer = correct_company_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        appointment = get_object_or_404(Appointment, id=pk)
        if request.user not in appointment.retailer.retailer.members.all(): #TODO add for brands
            raise PermissionDenied('You cant view this event')
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

    def get(self, request, pk, brand_id, format=None):
        brand = get_object_or_404(Brand, id=brand_id)
        tradeshow = get_object_or_404(Appointment, id=pk)
        if request.user not in tradeshow.retailer.retailer.members.all():
            raise PermissionDenied('You cant invite to an event you are not a part of')
        if tradeshow.appointment_type not in [Appointment.AppointmentType.TRADESHOW,Appointment.AppointmentType.OTHER]:
            raise Http404('No tradeshow with this ID')
        if brand not in tradeshow.brands.all():
            raise Http404('Brand not a part of this tradeshow')

        company_serializer = correct_company_serializer(request.user.company)
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

    def get(self, request, pk, format=None):
        showroom = get_object_or_404(Appointment, id=pk)

        if request.user not in showroom.retailer.retailer.members.all() and request.user not in showroom.brands.first().brand.members.all():
            raise PermissionDenied('You dont have permission to view this showroom')
        if showroom.appointment_type != Appointment.AppointmentType.SHOWROOM:
            return Http404('No showroom with this ID')

        company_serializer = correct_company_serializer(request.user.company)
        user_serializer = UserSerializer(request.user)
        brand = get_object_or_404(ParticipatingBrand, brand=showroom.brands.first(), appointment=showroom)
        return Response({
            'company':company_serializer.data,
            'user':user_serializer.data,
            'brand': ParticipatingBrandSerializer(brand).data,
            'appointment': AppointmentSerializer(showroom).data
        })