from rest_framework import serializers

from accounts.serializer import UserSerializer
from .models import Brand, Company, Retailer




class CompanySerializer(serializers.ModelSerializer):
    members = UserSerializer(read_only=True, many=True)
    class Meta:
        model = Company
        fields = ('id', 'name', 'members', 'bio', 'homepage')
        extra_kwargs = {
            'name': {'required': True},
            'members': {'required':False}
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
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts')

class RetailerSerializer(CompanySerializer):
    contacts = SimpleBrandSerializer(read_only=True, many=True, source='brands')
    class Meta:
        model = Retailer
        fields = ('id', 'name', 'members', 'bio', 'homepage', 'contacts')

def correct_serializer(company):
    company = company.get_correct_model()
    if type(Company) == Brand:
        return BrandSerializer(company)
    else:
        return RetailerSerializer(company)

def correct_simple_serializer(company):
    company = company.get_correct_model()
    if type(Company) == Brand:
        return SimpleBrandSerializer(company)
    else:
        return SimpleRetailerSerializer(company)