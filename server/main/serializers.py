# serializers.py
from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    def create(self, validated_data): 
      validated_data["is_active"] = True
      validated_data["password"] = make_password(validated_data["password"])
      return super().create(validated_data)
      
    class Meta:
      model = CustomUser
      fields = '__all__'


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        # Field-level validation
        if not attrs.get('username'):
            raise serializers.ValidationError('Username is required.')
        if not attrs.get('password'):
            raise serializers.ValidationError('Password is required.')
        return attrs
      
class CustomTokenSerializer(serializers.Serializer):
    token = serializers.CharField(source='key')
    user = UserSerializer()
    
class UserRelatedField(serializers.RelatedField):
  queryset = CustomUser.objects.all()
   
  def to_representation(self, value):
    user = UserSerializer(value)
    return user.data
     
  def to_internal_value(self, value):
    return CustomUser.objects.get(pk=value)