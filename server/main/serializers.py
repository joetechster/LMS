# serializers.py
from rest_framework import serializers
from .models import CustomUser, Course, Assessment, Grade
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
  
class CourseSerializer(serializers.ModelSerializer): 
  instructor = UserSerializer()
  students = UserSerializer(many=True)
  class Meta: 
    model = Course 
    fields = "__all__"

class AssessmentSerializer(serializers.ModelSerializer): 
  course = CourseSerializer()
  class Meta: 
    model = Assessment 
    fields = "__all__"
    
class GradeSerializer(serializers.ModelSerializer): 
  student = UserSerializer()
  assessment = AssessmentSerializer()
  class Meta:
    model = Grade
    fields = "__all__"