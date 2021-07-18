from rest_framework import serializers
from authentication.serializers import ProfessorSerializer, StudentSerializer
from playground.models import Classroom

class ClassroomSerializer(serializers.ModelSerializer): 

    creator = ProfessorSerializer()
    # students = StudentSerializer(many=True)

    class Meta:
        model = Classroom
        fields = ['id', 'name', 'description', 'subject', 'creator', 'code'] #, 'students']
        read_only_fields = ['id']