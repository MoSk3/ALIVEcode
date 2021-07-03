from django.contrib import admin

from playground.models import Challenge, Level, Classroom, Course, Quiz, Question, Response, Section, Activity, Challenge, ALIVEChallenge, ChallengeProgression, ActivityProgression
from home.models import Achievement

from django.contrib.auth import get_user_model
User = get_user_model()

# Register your models here.
@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ("name", "creator")

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    pass

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
class ActivityProgression(admin.ModelAdmin):
    list_display = ("user",)

@admin.register(ALIVEChallenge)
class ALIVEChallenge(admin.ModelAdmin):
    list_display = ("challenge",)

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("name",)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("question",)

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("text",)

@admin.register(ChallengeProgression)
class ChallengeProgressionAdmin(admin.ModelAdmin):
    list_display = ("user",)