from rest_framework import serializers

from accounts.serializer import UserSerializer
from .models import Brand, Company, Retailer, Note




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
        if self.Meta.model.objects.filter(name=attrs['name']).first():
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

class BrandSerializer(CompanySerializer):
    contacts = SimpleRetailerSerializer(read_only=True, many=True, source='retailers')
    class Meta:
        model = Brand
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts','logo')

class RetailerSerializer(CompanySerializer):
    contacts = SimpleBrandSerializer(read_only=True, many=True, source='brands')
    class Meta:
        model = Retailer
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts','logo')
        
def correct_company_serializer(company):
    company = company.get_correct_model()
    if type(Company) == Brand:
        return BrandSerializer(company)
    else:
        return RetailerSerializer(company)

def correct_simple_company_serializer(company):
    company = company.get_correct_model()
    if type(Company) == Brand:
        return SimpleBrandSerializer(company)
    else:
        return SimpleRetailerSerializer(company)


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