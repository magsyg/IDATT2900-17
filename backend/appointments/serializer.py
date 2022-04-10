from rest_framework import serializers

from accounts.serializer import UserSerializer
from companies.serializer import RetailerSerializer, BrandSerializer
from .models import Appointment, HostRetailer, ParticipatingBrand


class HostRetailerSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    retailer_participants = UserSerializer(read_only=True, many=True)
    retailer =  RetailerSerializer(read_only=True)

    class Meta:
        model = HostRetailer
        fields = ('id', 'retailer', 'retailer_participants', 'organizer')

class ParticipatingBrandSerializer(serializers.ModelSerializer):
    main_contact = UserSerializer(read_only=True)
    brand_participants = UserSerializer(read_only=True, many=True)
    brand =  BrandSerializer(read_only=True)
    
    class Meta:
        model = ParticipatingBrand
        fields = ('id', 'brand', 'brand_participants', 'main_contact')




class AppointmentSerializer(serializers.ModelSerializer):
    participatingbrand_set = ParticipatingBrandSerializer(read_only=True, many=True)
    retailer = HostRetailerSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ('id', 'name', 'appointment_type', 'date','time','other_information', 'retailer','participatingbrand_set')

 
class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ('id', 'name', 'appointment_type', 'date','time','other_information')


class HostRetailerCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = HostRetailer
        fields = ('id', 'retailer', 'retailer_participants', 'organizer')  
        extra_kwargs = {
            'retailer_participants': {'required':False}
        }
    def validate(self, attrs):
        if attrs['organizer'] not in attrs['retailer'].members.all():
            raise serializers.ValidationError({"organizer": "Organizer not part of this company"})
        if 'retailer_participants' in attrs.keys():
            for participant in attrs['retailer_participants']: 
                if participant not in attrs['retailer'].members.all():
                    raise serializers.ValidationError({"retailer_participants": f"{participant.get_full_name()} not part of this company"})
        return attrs

class ParticipatingBrandCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = ParticipatingBrand
        fields = ('id', 'brand', 'brand_participants', 'main_contact')
        extra_kwargs = {
            'brand_participants': {'required':False}
        }

    def validate(self, attrs):
        if attrs['main_contact'] not in attrs['brand'].members.all():
            raise serializers.ValidationError({"main_contact": "Main contact not part of this company"})
        if 'brand_participants' in attrs.keys():
            for participant in attrs['brand_participants']: 
                if participant not in attrs['brand'].members.all():
                    raise serializers.ValidationError({"brand_participants": f"{participant.get_full_name()} not part of this company"})
        return attrs

class AppointmentCreateSerializer(serializers.Serializer):
    brands = ParticipatingBrandCreateSerializer(read_only=False, many=True, allow_empty=False)
    retailer = HostRetailerCreateSerializer(read_only=False)
    appointment = AppointmentCreateSerializer(read_only=False)

    class Meta:
        fields = ('appointment', 'brands', 'retailer')


    def create(self):  

        host_retailer = HostRetailer.objects.create(
            retailer=self.validated_data['retailer']['retailer'],
            organizer=self.validated_data['retailer']['organizer'],
           )
        if 'retailer_participants' in self.validated_data['retailer']:
            host_retailer.retailer_participants.set(self.validated_data['retailer']['retailer_participants'])
        appointment = Appointment.objects.create(
            name=self.validated_data['appointment']['name'],
            retailer=host_retailer,
            time=self.validated_data['appointment']['time'],
            date=self.validated_data['appointment']['date'],
            other_information=self.validated_data['appointment']['other_information'],
            )
        for brand in self.validated_data['brands']:
            p_brand = ParticipatingBrand.objects.create(
                brand=brand['brand'],
                main_contact=brand['main_contact'],
                appointment=appointment,
            )
            if 'brand_participants' in self.validated_data['retailer']:
                p_brand.brand_participants.set(self.validated_data['retailer']['brand_participants'])
        return AppointmentSerializer(appointment)