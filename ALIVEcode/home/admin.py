from django.contrib import admin

from django.contrib.auth import get_user_model
User = get_user_model()

from django.apps import apps
Student = apps.get_model('home', 'Student')
Professor = apps.get_model('home', 'Professor')
Achievement = apps.get_model('home', 'Achievement')


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