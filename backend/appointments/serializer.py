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
    brands = ParticipatingBrandSerializer(read_only=True, many=True, source='participatingbrand_set')
    retailer = HostRetailerSerializer(read_only=True) 
    class Meta:
        model = Appointment
        fields = ('id', 'name', 'appointment_type', 'date','start_time','end_time','other_information', 'retailer','brands')

 
class SimpleAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ('id', 'name', 'appointment_type', 'date','start_time','end_time','other_information')

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ('id', 'name', 'appointment_type', 'date','start_time','end_time','other_information', 'is_request')



class HostRetailerCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = HostRetailer
        fields = ('id', 'retailer', 'retailer_participants', 'organizer')  
        extra_kwargs = {
            'retailer_participants': {'required':False},
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
        fields = ('id', 'brand', 'brand_participants', 'main_contact', 'appointment')
        extra_kwargs = {
            'brand_participants': {'required':False},
            'appointment': {'required':False},
        }

    def validate(self, attrs):
        if 'main_contact' in attrs:
            if attrs['main_contact'] not in attrs['brand'].members.all():
                raise serializers.ValidationError({"main_contact": "Main contact not part of this company"})
        if 'brand_participants' in attrs.keys():
            for participant in attrs['brand_participants']: 
                if participant not in attrs['brand'].members.all():
                    raise serializers.ValidationError({"brand_participants": f"{participant.get_full_name()} not part of this company"})
        return attrs
    
    def create(self):
        print(self.validated_data)
        brand = ParticipatingBrand.objects.create(
                brand=self.validated_data['brand'],
                main_contact=self.validated_data['main_contact'],
                appointment=self.validated_data['appointment'],
            )
        if 'brand_participants' in self.validated_data:
           brand.brand_participants.set(self.validated_data['brand_participants'])
        return brand

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
        print(self.validated_data['appointment'].keys(), 'is_request' in self.validated_data['appointment'].keys())
        is_request = False 
        if ('is_request' in self.validated_data['appointment'].keys()):
            is_request = self.validated_data['appointment']['is_request']
        appointment = Appointment.objects.create(
            name=self.validated_data['appointment']['name'],
            retailer=host_retailer,
            appointment_type=self.validated_data['appointment']['appointment_type'],
            start_time=self.validated_data['appointment']['start_time'],
            end_time=self.validated_data['appointment']['end_time'],
            date=self.validated_data['appointment']['date'],
            is_request=is_request,
            other_information=self.validated_data['appointment']['other_information'],
            )
        for brand in self.validated_data['brands']:
            p_brand = ParticipatingBrand.objects.create(
                brand=brand['brand'],
                appointment=appointment,
            )
            if 'main_contact' in brand:
                p_brand.main_contact = brand['main_contact']
            if 'brand_participants' in brand:
                p_brand.brand_participants.set(brand['brand_participants'])
            p_brand.save()
        return AppointmentSerializer(appointment)