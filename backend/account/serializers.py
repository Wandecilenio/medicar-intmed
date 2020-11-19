from rest_framework import serializers

from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta():
        fields = ('id', 'email', 'name', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        model = User
    
    def create(self, validate_data):
        validate_data.update({ 'is_staff': False, 'is_superuser': False })
        user = User.objects.create_user(**validate_data)
        return user

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta():
        fields = ('id', 'email', 'name')
        model = User