# serializers.py
from rest_framework import serializers
from .models import CustomUser, Course, Assessment, Grade, Question, FeedBackMessage, CourseMaterial
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
  
class CourseMaterialSerializer(serializers.ModelSerializer): 
  class Meta: 
    model = CourseMaterial
    fields = '__all__'
    
class CourseSerializer(serializers.ModelSerializer): 
  instructor = UserSerializer()
  students = UserSerializer(many=True)
  materials = CourseMaterialSerializer(read_only=True, many=True)
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

import json
class GradeSerializer(serializers.ModelSerializer): 
  student = UserSerializer(read_only=True)
  assessment = AssessmentSerializer(read_only=True)

  def calculate_grade(self, validated_data):
    assessment_questions = Assessment.objects.get(id=self.initial_data.get("assessment")).questions.all()
    if len(assessment_questions) < 1: return 0
    selected_answers = json.loads(validated_data.get("answers")) # {question.id: selected(a, b, ...), ...}
    grade = 0 
    for question in assessment_questions: 
      if question.answer == selected_answers.get(str(question.id)): grade = grade + 1
    grade = round(( grade / len(assessment_questions)) * 100)
    return grade
  
  def create(self, validated_data):
    student = CustomUser.objects.get(id=self.initial_data.get("student"))
    assessment = Assessment.objects.get(id=self.initial_data.get("assessment"))
    grade_obj = Grade.objects.filter(assessment=assessment, student=student).first()
    if grade_obj: return grade_obj 
    grade = self.calculate_grade(validated_data)
    validated_data["student"] = student
    validated_data["assessment"] = assessment
    return Grade.objects.create(grade=grade, **validated_data)
  
  
  class Meta:
    model = Grade
    fields = "__all__"
    
class FeedBackSerializer(serializers.ModelSerializer):
  sent_by = UserSerializer(read_only=True)
  course = CourseSerializer(read_only=True)
  
  def create(self, validated_data): 
    sent_by = self.context['request'].user 
    course = Course.objects.get(id=self.initial_data.get('course')) 
    message = validated_data.get('message')
    if sent_by.type == 'student': 
      sent_to = course.instructor
    else: 
      sent_to = validated_data.get('sent_to')
    return FeedBackMessage.objects.create(sent_by=sent_by, course=course, sent_to=sent_to, message=message)  

  class Meta: 
    model = FeedBackMessage
    fields = "__all__"