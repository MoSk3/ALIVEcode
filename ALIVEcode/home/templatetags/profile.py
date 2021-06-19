from django import template
from home.models import User, Student, Professor

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