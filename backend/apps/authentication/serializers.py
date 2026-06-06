from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'phone_number',
            'role',
            'country',
            'additional_information'
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            role=validated_data.get('role', 'Vendor'),
            country=validated_data.get('country', ''),
            additional_information=validated_data.get('additional_information', '')
        )
        if user.role == 'Vendor':
            from apps.vendors.models import Vendor
            Vendor.objects.create(
                user=user,
                vendor_name=f"{user.first_name} {user.last_name}".strip() or user.username,
                category="Other",
                gst_no="27AABCS1429Bz0",
                contact_no=user.phone_number or "0000000000",
                status="Active"
            )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims to the JWT payload
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['name'] = f"{user.first_name} {user.last_name}".strip() or user.username
        
        return token
