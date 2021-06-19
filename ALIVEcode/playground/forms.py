from playground.models import Challenge, Quiz, Question, Response, Classroom, Course
from django import forms

class QuizCreationForm(forms.ModelForm):

    def save(self, commit = True, request=None):   
        quizCree = super(QuizCreationForm, self).save(commit=False)
        quizCree.creator = request.user
        if commit: 
            quizCree.save()
        return quizCree
        
    class Meta:
        model = Quiz
        fields = ['name']
    

class QuestionCreationForm(forms.ModelForm):
    class Meta:
        model = Question
        fields = ['question','timer']

class ReponseCreationForm(forms.ModelForm):
    text=forms.CharField(max_length=255, required=False)
    correct = forms.BooleanField(required=False, initial=False)
    class Meta:
        model = Response
        fields = ['text','correct']
    

class ClassroomCreationForm(forms.ModelForm):

    class Meta:
        model = Classroom
        fields = ['name', 'description', 'subject']


class CourseCreationForm(forms.ModelForm):

    class Meta:
        model = Course
        fields = ['name', 'description', 'subject', 'difficulty', 'access']
        
        
class ChallengeCreationForm(forms.ModelForm):

    class Meta:
        model = Challenge
        fields = ['name', 'desc', 'hint', 'access']