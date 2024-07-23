from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from .views import SignUpView, SignInView, CourseViewSet, AssessmentViewSet, GradeViewSet, EnrollView, QuestionViewSet, ManyQuestionView
from django.conf.urls.static import static
from django.conf import settings
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'course', CourseViewSet, basename='course')
router.register(r'assessment', AssessmentViewSet, basename='assessment')
router.register(r'grade', GradeViewSet, basename='grade')
router.register(r'question', QuestionViewSet, basename='question')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sign-up/', SignUpView.as_view(), name='Sign Up'),
    path('sign-in/', SignInView.as_view(), name='Sign In'), 
    path('enroll/<int:course_id>', EnrollView.as_view(), name='enroll'), 
    path('many-question/', ManyQuestionView.as_view(), name='many-question'), 
    path('', include(router.urls))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
