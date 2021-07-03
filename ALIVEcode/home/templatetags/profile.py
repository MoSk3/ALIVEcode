from django import template

from django.contrib.auth import get_user_model
User = get_user_model()

from django.apps import apps
Student = apps.get_model('home', 'Student')
Professor = apps.get_model('home', 'Professor')

register = template.Library()

@register.filter(name='isProfessor')
def isProfessor(user):
    return user.isProfessor()

@register.filter(name='isStudent')
def isStudent(user):
    return user.isStudent()

@register.filter(name='is')
def isUser(arg1, arg2):
    user1 = None
    user2 = None
    if isinstance(arg1, User):
        user1 = arg1
    elif isinstance(arg1, (Professor, Student)):
        user1 = arg1.user
    
    if isinstance(arg2, User):
        user2 = arg2
    elif isinstance(arg2, (Professor, Student)):
        user2 = arg2.user

    return user1 is not None and user2 is not None and user1 == user2