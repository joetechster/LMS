# serializers.py
from rest_framework import serializers
from .models import CustomUser, Course, Assessment, Grade, Question
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

class QuestionSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField()
  
  def create(self, validated_data): 
    hack = validated_data.pop("hack")
    if hack is not None:
      id = validated_data.pop('id')
      if self.initial_data[0].get("new"):
        assessment = validated_data.pop('assessment')
        question = Question.objects.create(assessment=assessment, **validated_data)
        return question
      else:
        question, created = Question.objects.update_or_create(defaults=validated_data, id=id)
        return question
    else: return super().create(validated_data)
    
  class Meta: 
    model = Question
    fields = "__all__"

class AssessmentSerializer(serializers.ModelSerializer): 
  course = CourseSerializer(read_only=True)
  questions = QuestionSerializer(read_only=True, many=True)
  
  def create(self, validated_data): 
    course = Course.objects.get(id=self.initial_data.get("course"))
    return Assessment.objects.create(course=course, **validated_data)
  
  class Meta: 
    model = Assessment 
    fields = "__all__"

class GradeSerializer(serializers.ModelSerializer): 
  student = UserSerializer(read_only=True)
  assessment = AssessmentSerializer(read_only=True)

  def create(self, validated_data):
    validated_data["student"] = CustomUser.objects.get(id=self.initial_data.get("student"))
    validated_data["assessment"] = Assessment.objects.get(id=self.initial_data.get("assessment"))
    return Grade.objects.create(**validated_data)
  class Meta:
    model = Grade
    fields = "__all__"