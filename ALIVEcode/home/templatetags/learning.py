from django import template
from django.apps import apps
from playground.models import ActivityProgression, Activity, Challenge
import json

register = template.Library()

@register.filter(name='get_activities')
def get_activities(section):
    return Activity.objects.filter(section=section)

@register.filter(name='to_dict')
def to_dict(val: str) -> dict:
    return json.loads(val)

@register.filter(name='isType')
def isType(challenge: Challenge, typeStr: str) -> bool:
    foreignKeyType = apps.get_model('playground', typeStr)
    return challenge.isType(foreignKeyType)

@register.filter(name='get_progression')
def get_progression(activity,user):
    activityProgressions = ActivityProgression.objects.filter(activity=activity,user=user)
    if activityProgressions.exists():
        return activityProgressions.first()