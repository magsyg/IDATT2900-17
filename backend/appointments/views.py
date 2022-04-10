# imports
from logging import raiseExceptions
from django.views import View
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse, HttpResponse, Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication

from .serializer import AppointmentCreateSerializer, HostRetailerSerializer
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