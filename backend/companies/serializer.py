from rest_framework import serializers

from .models import Brand, Company, Retailer




class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ('id', 'name', 'members')


    def validate(self, attrs):
        if self.Meta.model.objects.filter(name=attrs['name']).first():
            raise serializers.ValidationError({"name": f"{self.Meta.model.get_model_name} with same name already exists"})
        return attrs

    def create(self):  
        company = self.Meta.model.objects.create(
            name=self.validated_data['name']
        )
        return company

class BrandSerializer(CompanySerializer):
    class Meta:
        model = Brand
        fields = ('id', 'name', 'members')

class RetailerSerializer(CompanySerializer):
    class Meta:
        model = Retailer
        fields = ('id', 'name', 'members')


    