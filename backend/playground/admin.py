from django.contrib import admin

from playground.models import Level, Classroom, Course, Quiz, Question, Response, Section, Activity, Level, SimulationLevel, LevelProgression, ActivityProgression
from home.models import Achievement

from django.contrib.auth import get_user_model
User = get_user_model()

# Register your models here.
@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("name", "creator")

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ("name", "subject", "creator")

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("name", "subject")

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    list_filter = ("section",)

@admin.register(ActivityProgression)
class ActivityProgressionAdmin(admin.ModelAdmin):
    list_display = ("user",)

@admin.register(SimulationLevel)
class SimulationLevelAdmin(admin.ModelAdmin):
    list_display = ("level",)

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question",)

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("text",)

@admin.register(LevelProgression)
class LevelProgressionAdmin(admin.ModelAdmin):
    list_display = ("user",)