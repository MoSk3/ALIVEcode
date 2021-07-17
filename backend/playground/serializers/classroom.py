from rest_framework import serializers
from authentication.serializers import ProfessorSerializer
from playground.models import Classroom

class ClassroomSerializer(serializers.ModelSerializer): 

    creator = ProfessorSerializer()

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'description', 'subject', 'creator', 'code']
        read_only_fields = ['id']