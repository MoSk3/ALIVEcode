from rest_framework import serializers
from authentication.serializers import ProfessorSerializer, StudentSerializer
from playground.models import Course

class CourseSerializer(serializers.ModelSerializer): 

    creator = ProfessorSerializer()

    class Meta:
        model = Course
        fields = ['id', 'name', 'description', 'subject', 'creator', 'code', 'difficulty', 'access']
        read_only_fields = ['id']