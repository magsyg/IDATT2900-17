from rest_framework import serializers

from accounts.serializer import UserSerializer
from .models import Brand, Company, Retailer, Note, ShowRoom




class CompanySerializer(serializers.ModelSerializer):
    members = UserSerializer(read_only=True, many=True)
    class Meta:
        model = Company
        fields = ('id', 'name', 'members', 'bio', 'homepage','logo')
        extra_kwargs = {
            'name': {'required': True},
            'members': {'required':False},
            'logo': {'required':False},
        }

    def validate(self, attrs):
        if 'name' in attrs and self.Meta.model.objects.filter(name=attrs['name']).first():
            raise serializers.ValidationError({"name": f"{self.Meta.model.get_model_name} with same name already exists"})
        return attrs

    def create(self):  
        company = self.Meta.model.objects.create(
            name=self.validated_data['name']
        )
        return company

class SimpleBrandSerializer(CompanySerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class SimpleRetailerSerializer(CompanySerializer):
    class Meta:
        model = Retailer
        exclude = ('brands',)

class ShowroomSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShowRoom
        fields = ['id', 'brand', 'doorcode', 'floor', 'address', 'city', 'country', 'hours_start', 'hours_end', 'date_range_start','date_range_end', 'is_current']

class BrandSerializer(CompanySerializer):
    contacts = SimpleRetailerSerializer(read_only=True, many=True, source='retailers')
    current_showroom = ShowroomSerializer()
    class Meta:
        model = Brand
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts', 'logo', 'current_showroom')

class RetailerSerializer(CompanySerializer):
    contacts = SimpleBrandSerializer(read_only=True, many=True, source='brands')
    class Meta:
        model = Retailer
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts','logo')
        
def correct_company_serializer(company, *args, **kwargs):
    company = company.get_correct_model()
    if company.company_type == 'BRAND':
        return BrandSerializer(company, *args, **kwargs)
    else:
        return RetailerSerializer(company, *args, **kwargs)

def correct_simple_company_serializer(company, *args, **kwargs):
    company = company.get_correct_model()
    if company.company_type == 'BRAND':
        return SimpleBrandSerializer(company, *args, **kwargs)
    else:
        return SimpleRetailerSerializer(company, *args, **kwargs)


class NoteSerializer(serializers.ModelSerializer):  
    creator = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    def get_creator(self, obj):
        return '{} {}'.format(obj.creator.first_name, obj.creator.last_name) 
    def get_company(self, obj):
        return '{}'.format(obj.company.get_correct_model().name) 
    class Meta:
        model = Note
        fields = ('text', 'timestamp', 'creator', 'company')


class CreateNoteSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Note
        fields = ('text', 'creator', 'company')

    def create(self):  
        note = self.Meta.model.objects.create(
            text=self.validated_data['text'],
            creator=self.validated_data['creator'],
            company=self.validated_data['company'],
        )
        return note



