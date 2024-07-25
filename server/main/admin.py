from django.contrib import admin
from .models import CustomUser, Grade, Course, Question, Assessment

# @admin.register(CustomUser)
# class CustomUserAdmin(admin.ModelAdmin):
#     list_display = ('username', 'is_staff', 'is_active', 'passport')
#     fieldsets = (
#         (None, {'fields': ('first_name', 'last_name', 'email', 'password', 'username', 'passport', 'type')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active')}),
#     )
#     # Password field should be hidden for security reasons
#     readonly_fields = ('password',)

admin.site.register(CustomUser)
admin.site.register(Grade)
admin.site.register(Course)
admin.site.register(Question)
admin.site.register(Assessment)