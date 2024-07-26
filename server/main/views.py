from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import (UserSerializer, CustomTokenSerializer, LoginSerializer, 
CourseSerializer, AssessmentSerializer, GradeSerializer, QuestionSerializer)
from .permissions import IsOwnerOrIsAdminOrReadOnly
from rest_framework.authentication import TokenAuthentication
from .models import Course, Assessment, Question, Grade
from django.contrib.auth import authenticate
from django.db.models import Q
from .bot import get_response
class SignUpView(APIView):
  def post(self, request):
    user_serializer = UserSerializer(data=request.data)
    user_serializer.is_valid(raise_exception=True)
    if user_serializer.is_valid():
      user = user_serializer.save()
      token, created = Token.objects.get_or_create(user=user)
      serializer = CustomTokenSerializer(data={'token': token.key, 'user': UserSerializer(user).data})
      serializer.is_valid()
      return Response(serializer.data, status=status.HTTP_201_CREATED)

class SignInView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user = authenticate(username=serializer.data['username'], password=serializer.data['password'])
      if user:
        token, created = Token.objects.get_or_create(user=user)
        serializer = CustomTokenSerializer(data={'token': token.key, 'user': UserSerializer(user).data})
        serializer.is_valid()
        return Response(serializer.data)
      else: 
        return Response("Wrong username or password", status=400)
      
class CourseViewSet(viewsets.ModelViewSet): 
  queryset = Course.objects.all()
  serializer_class = CourseSerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
    if self.request.user.type == "instructor": 
      return self.request.user.courses_taught.all()
    all = self.request.GET.get("all")
    if not all:
      return self.request.user.courses_attending.all()
    return super().get_queryset()

class AssessmentViewSet(viewsets.ModelViewSet): 
  serializer_class = AssessmentSerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
    if self.request.user.type == "instructor": 
      return Assessment.objects.filter(course__in=self.request.user.courses_taught.all())
    # return assessment student have not yet taken
    return Assessment.objects.filter(~Q(scores__student=self.request.user), course__in=self.request.user.courses_attending.all()).all()

class GradeViewSet(viewsets.ModelViewSet): 
  serializer_class = GradeSerializer
  permission_classes = [IsAuthenticated]
  
  def get_queryset(self):
    if self.request.user.type == "instructor": 
      return Grade.objects.filter(assessment__in=Assessment.objects.filter(course__in=self.request.user.courses_taught.all()))
    return self.request.user.grades.all()
  
class EnrollView(APIView): 
  permission_classes = [IsAuthenticated]
  
  def post(self, request, course_id): 
    user = request.user
    course = Course.objects.get(id=course_id)
    user.courses_attending.add(course)
    return Response()
  
class QuestionViewSet(viewsets.ModelViewSet): 
  queryset = Question.objects.all()
  serializer_class = QuestionSerializer
  permission_classes = [IsAuthenticated]
  
class ManyQuestionView(APIView): 
  permission_classes = [IsAuthenticated]
  
  def post(self, request):
    serializer = QuestionSerializer(data=request.data, many=True, partial=True) 
    if (serializer.is_valid(raise_exception=True)): 
      serializer.save(hack=True)
    return Response(serializer.data)
  
class ChatView(APIView): 
  def post(self, request): 
    question = request.data["question"]
    context = request.data["context"]
    res = get_response(question, context)
    return Response(res.text)
  
class AssessmentGradesView(APIView): 
  def get(self, request, assessment_id):
    scores = Assessment.objects.get(id=assessment_id).scores
    grade_serializer = GradeSerializer(scores, many=True)
    return Response(grade_serializer.data)
    