from django.db import models

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

class MyUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email
        and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        if not password:
            raise ValueError('Users must have a password')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        """
        Creates and saves a superuser with the given email
        and password.
        """

        if not email:
            raise ValueError('Users must have an email address')
        
        if not password:
            raise ValueError('Users must have a password')

        user = self.create_user(
            email,
            password=password
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    email = models.EmailField(unique=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    photo = models.ImageField(null=True, blank=True)
    
    achievements = models.ManyToManyField('home.Achievement', blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    objects = MyUserManager()
    
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
        return False

    def __str__(self):
        return f"{self.email}"

class Achievement(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
        
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
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
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=20)
    last_name  = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.first_name} {self.last_name}, {self.user}"

