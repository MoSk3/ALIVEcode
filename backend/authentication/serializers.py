from rest_framework import serializers
from home.models import User, Student, Professor

class StudentSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Student
        fields = ('name', 'scholarity')

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ('first_name', 'last_name')


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True
    )

    password = serializers.CharField(min_length=8, write_only=True)

    # Student's fields
    name = serializers.CharField(source='student.name', max_length=20, required=False)
    scholarity = serializers.ChoiceField(source='student.scholarity', choices=Student.SCHOLARITY_CHOICES, required=False)

    # Professor's fields
    first_name = serializers.CharField(source='professor.first_name', max_length=20, required=False)
    last_name  = serializers.CharField(source='professor.last_name', max_length=25, required=False)

    class Meta:
        model = User
        fields = ('email', 'password', 'name', 'scholarity', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        if 'first_name' in validated_data and 'last_name' in validated_data:
            instance.registerProfessor(self.validated_data['first_name'], self.validated_data['last_name'])
        elif 'name' in validated_data and 'scholarity' in validated_data:
            instance.registerStudent(self.validated_data['name'])
        instance.save()
        return instance