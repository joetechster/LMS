from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_active', 'passport')
    fieldsets = (
        (None, {'fields': ('first_name', 'last_name', 'email', 'password', 'username', 'passport')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    # Password field should be hidden for security reasons
    readonly_fields = ('password',)
