from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
  passport = models.ImageField(upload_to='passports/', blank=True, verbose_name="Passport (Photo)")
  address = models.TextField(blank=True, verbose_name="Address")
  type = models.TextField(choices=(("student", "Student"), ("instructor", "Instructor")), default="student")
  
  def __str__(self):
      return self.email
    
  class Meta:
    verbose_name = "User"
    verbose_name_plural = "Users"
    
# Courses
class Course(models.Model): 
  title = models.TextField(max_length=500)
  code = models.TextField(max_length=20)
  instructor = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="courses_taught")
  students = models.ManyToManyField(CustomUser, related_name="courses_attending")
  
  def __str__(self):
      return f"{self.title} ({self.code})"
  
# Assessments
class Assessment(models.Model): 
  title = models.TextField(max_length=500)
  description = models.TextField()
  time = models.DateTimeField(auto_now_add=True)
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="assessments")

  def __str__(self):
      return f"{self.title} ({self.course.code})"
  
class Question(models.Model): 
  description = models.TextField()
  answer = models.TextField(choices=(("a", "a"), ("b", "b"), ("c", "c"), ("d", "d")))
  a = models.TextField()
  b = models.TextField()
  c = models.TextField()
  d = models.TextField()
  assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="questions")
  
class Grade(models.Model): 
  grade = models.IntegerField()
  student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="grades")
  assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="scores")