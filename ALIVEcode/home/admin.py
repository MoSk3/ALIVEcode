from django.contrib import admin

from home.models import User, Professor, Student, Achievement

# Register your models here.
@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    pass

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")
    pass

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name",)
    pass