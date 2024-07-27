from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from .views import (SignUpView, SignInView, CourseViewSet, AssessmentViewSet, GradeViewSet, EnrollView, 
QuestionViewSet, ManyQuestionView, ChatView, AssessmentGradesView, FeedbackMessageView, StudentViewSet)
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'course', CourseViewSet, basename='course')
router.register(r'assessment', AssessmentViewSet, basename='assessment')
router.register(r'grade', GradeViewSet, basename='grade')
router.register(r'question', QuestionViewSet, basename='question')
router.register(r'message', FeedbackMessageView, basename='feedback-message')
router.register(r'student', StudentViewSet, basename='students')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sign-up/', SignUpView.as_view(), name='Sign Up'),
    path('sign-in/', SignInView.as_view(), name='Sign In'), 
    path('enroll/<int:course_id>', EnrollView.as_view(), name='enroll'), 
    path('chat/', ChatView.as_view(), name='chat'), 
    path('grades/<int:assessment_id>', AssessmentGradesView.as_view(), name='grades'), 
    path('many-question/', ManyQuestionView.as_view(), name='many-question'), 
    path('', include(router.urls))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
