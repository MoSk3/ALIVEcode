from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import UserManager
from django.contrib.contenttypes.models import ContentType

import playground.models


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
        
class Student(models.Model):
    user = models.OneToOneField('home.user', on_delete=models.CASCADE)
    courses = models.ManyToManyField("playground.course")

    name = models.CharField(max_length=20)

    scholarity = models.CharField(max_length=2, choices=[
        ("p1", "1ère année"),
        ("p2", "2e année"),
        ("p3", "3e année"),
        ("p4", "4e année"),
        ("p5", "5e année"),
        ("p6", "6e année"),
        ("s1", "secondaire 1"),
        ("s2", "secondaire 2"),
        ("s3", "secondaire 3"),
        ("s4", "secondaire 4"),
        ("s5", "secondaire 5"),
        ("c", "cégep")
    ])

    def __str__(self):
        return f"{self.name}, {self.user}"

class Professor(models.Model):
    user = models.OneToOneField('home.user', on_delete=models.CASCADE)

    first_name = models.CharField(max_length=20)
    last_name  = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.first_name} {self.last_name}, {self.user}"


class User(AbstractBaseUser, BaseUserManager):
    email = models.EmailField(unique=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    photo = models.ImageField(null=True, blank=True)
    
    achievements = models.ManyToManyField(Achievement, blank=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()


    """
    ATTENTION À CHANGER COMPLÈTEMENT
    """
    
    def has_module_perms(self, perm):
        return self.is_staff or self.is_superuser

    def has_perm(self, perm):
        return self.is_staff or self.is_superuser

    def registerStudent(self, name):
        newStudent = Student.objects.create(user=self, name=name, scholarity="s2")
        #self.is_superuser = True
        #self.is_staff = True
        #self.save()

    def registerProfessor(self, first_name, last_name):
        newProfessor = Professor.objects.create(user=self, first_name=first_name, last_name=last_name)
        #self.is_superuser = True
        #self.is_staff = True
        #self.save()

    def isStudent(self):
        return getattr(self, "student", None) is not None

    def isProfessor(self):
        return getattr(self, "professor", None) is not None

    def get_display_name(self):
        if self.isProfessor():
            return f"{self.professor.first_name} {self.professor.last_name}"
        elif self.isStudent():
            return self.student.name
        return ""

    def isProperty(self, obj, propertyName: str) -> bool:
        foreignKeyType = getattr(type(obj), propertyName).field.related_model
        if foreignKeyType == Professor:
            if not self.isProfessor():
                return False
            return getattr(obj, propertyName) == self.professor
        elif foreignKeyType == Student:
            if not self.isStudent():
                return False
            return getattr(obj, propertyName) == self.student
        elif foreignKeyType == User:
            return getattr(obj, propertyName) == self

    def __str__(self):
        return f"{self.email}"

