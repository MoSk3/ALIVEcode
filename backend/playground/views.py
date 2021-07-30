from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.core import serializers
from django.views import View

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from playground.forms import QuizCreationForm, QuestionCreationForm, ReponseCreationForm
from playground.models import Question, Quiz, Response as QuizResponse
from playground.serializers.course import CourseSerializer
from .models import Challenge, Classroom

from rest_framework.views import APIView
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from playground.serializers.classroom import ClassroomSerializer
from authentication.serializers import StudentSerializer
from rest_framework import viewsets, status, authentication
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.response import Response

from django.contrib.auth import get_user_model
User = get_user_model()

class ClassroomStudents(APIView):
    #authentication_classes = [authentication.TokenAuthentication] <- Weird not working
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format='json', pk=None):
        queryset = request.user.getClassrooms()
        classroom = get_object_or_404(queryset, pk=pk)
        serializer = StudentSerializer(classroom.students, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ClassroomCourses(APIView):
    #authentication_classes = [authentication.TokenAuthentication] <- Weird not working
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format='json', pk=None):
        queryset = request.user.getClassrooms()
        classroom = get_object_or_404(queryset, pk=pk)
        serializer = CourseSerializer(classroom.courses, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ClassroomViewSet(viewsets.ViewSet):  

    def list(self, request):
        """
        {
            body: {
                filter: 
            }
        }
        """
        queryset = request.user.getClassrooms()
        if queryset is None:
            queryset = Classroom.objects.none()
        serializer = ClassroomSerializer(queryset, many=True)
        return Response(serializer.data)

    # Detail is used to generate a route like so: /playground/users/:pk/get

    def retrieve(self, request, pk=None):
        try:
            queryset = request.user.getClassrooms()
            classroom = get_object_or_404(queryset, pk=pk)
            serializer = ClassroomSerializer(classroom)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


"""
class ClassroomViewSet(viewsets.ViewSet):
    """"""
    A simple ViewSet for listing or retrieving users.
    """"""
    def list(self, request):
        queryset = request.user.getClassrooms()
        if queryset is None:
            queryset = Classroom.objects.none()
        serializer = ClassroomSerializer(queryset, many=True)
        return Response(serializer.data)


    def retrieve(self, request, pk=None):
        try:
            queryset = request.user.getClassrooms()
            if queryset is None:
                queryset = Classroom.objects.none()
                classroom = get_object_or_404(queryset, pk=pk)
                serializer = ClassroomSerializer(classroom)
                return Response(serializer.data)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
"""

loginPage = '/login'

# Create your views here.
@login_required(login_url=loginPage)
def index(request):
    return render(request, 'playground/index.html')

@login_required(login_url=loginPage)
def code(request):
    challenge = None
    """
    if request.method == 'GET':
        if 'lvl' in request.GET:
            challenge = Challenge.objects.get(id=request.GET['lvl'])
    if challenge is None:
        return render(request, 'playground/code.html')
    """
    return render(request, 'playground/code.html')

@login_required(login_url=loginPage)
def blocs(request):
    challenge = None
    """
    if request.method == 'GET':
        if 'lvl' in request.GET:
            challenge = Challenge.objects.get(id=request.GET['lvl'])
    if challenge is None:
        return render(request, 'playground/blocs.html')
    """
    return render(request, 'playground/blocs.html')
"""
@login_required(login_url=loginPage)
def nextLevel(request):
    nextChallenge = None
    if request.method != 'POST':
        return render(request, 'playground/blocs.html')
    if 'lvl' in request.POST:
        try:
            challenge = Challenge.objects.get(id=request.POST['lvl'])
            if challenge.num + 1 < Challenge.objects.all().count():  
                nextChallenge = Challenge.objects.get(num=(challenge.num+1))
            else:
                nextChallenge = challenge
        except:
            nextChallenge = Challenge.objects.get(num=0)
    else:
        nextChallenge = Challenge.objects.get(num=0)
    print("USER COMPLETED THE LEVEL " + str(challenge.num + 1))
    return render(request, 'playground/nextLevel.html', {
        'lvl': nextChallenge,
        'next': serializers.serialize('json', [nextChallenge], ensure_ascii=False),
    })
"""
def pensee(request):
    return render(request, 'playground/pensee.html')

@login_required(login_url=loginPage)
def newQuiz(request):
    context = {
        "form": QuizCreationForm()
    }
    if request.method == "POST":
        quizForm = QuizCreationForm(request.POST)
        if quizForm.is_valid():
            quizCree = quizForm.save(request = request)
            request.session["currentQuiz"] = str(quizCree.id)
            return redirect('playground:updateQuiz', quizCree.id)
    
    return render(request, 'playground/newQuiz.html', context)



@login_required(login_url=loginPage)
def mesQuiz(request):
        try: 
            quiz = Quiz.objects.filter(creator = request.user)
            context ={
                "listquiz": quiz
            }
            return render(request, 'playground/mesQuiz.html', context)
        except Quiz.DoesNotExist: pass 
        return redirect('home:index')  

@login_required(login_url=loginPage)
def deleteQuiz(request, pk):
    try:
        quiz=Quiz.objects.get(id=pk, creator=request.user)
    except Quiz.DoesNotExist:
        return redirect('home:index')
    context={'item':quiz}
    if request.method=="POST":
        quiz.delete()
        return redirect('/playground/mes_quiz')
    return render(request, 'playground/deleteQuiz.html', context)

@login_required(login_url=loginPage)
def updateQuiz(request, pk):
    quiz=Quiz.objects.get(id=pk)
    questionsList=Quiz.objects.get(id=quiz.id).questions.all()
    questionsQuiz=sorted(questionsList, key=lambda q:q.numero)
    questionForm = QuestionCreationForm()
    reponseForm=[ReponseCreationForm() for x in range(0,6)]
    request.session["currentQuiz"]=pk
    if request.method == "POST":
        questionForm = QuestionCreationForm(request.POST)
        reponseForm=[ReponseCreationForm(request.POST,prefix=str(x)) for x in range(0,6)]
        if questionForm.is_valid() and all([rf.is_valid() for rf in reponseForm]):
            questionCree=questionForm.save(commit=False)
            questionCree.numero=len(Quiz.objects.get(id=quiz.id).questions.all())+1
            questionCree.save()
        lstReponsesText=request.POST.getlist('text')
        lstReponsesCorrect=request.POST.getlist('correct')
        print(lstReponsesText)
        i=0
        for form in reponseForm:
            reponseCree=form.save(commit=False)
            if 0 <= i < len(lstReponsesText):
                if lstReponsesText[i] != "":
                    reponseCree.text=lstReponsesText[i]
                    if 0 <= i < len(lstReponsesCorrect):
                        if lstReponsesCorrect[i] == 'on':
                            reponseCree.correct = True    
                    elif i > len(lstReponsesCorrect):
                        reponseCree.correct = False
                    reponseCree.save()
                    i += 1
                    questionCree.answers.add(reponseCree)
        quiz.questions.add(questionCree)
        return redirect('playground:updateQuiz', quiz.id)
    context = {'quiz': quiz, "question_form": questionForm,
                    "reponse_form": reponseForm, 'questionsQuiz':questionsQuiz}
    return render(request, 'playground/viewQuiz.html', context)

class deleteQuestion(View):
    def get(self, request):
        id1 = request.GET.get('id', None)
        Question.objects.get(id=id1).delete()
        data = {
            'deleted': True
        }
        return JsonResponse(data)

@login_required(login_url=loginPage)
def updateQuestion(request,pk):
    question=Question.objects.get(id=pk)
    questionForm=QuestionCreationForm(instance=question)
    reponseForm=[ReponseCreationForm(prefix=str(reponse.id), instance=reponse) for reponse in question.answers.all()]
    if request.method=='POST':
        questionForm = QuestionCreationForm(request.POST, instance=question)
        reponseForm=[ReponseCreationForm(request.POST,prefix=str(reponse.id), instance=reponse) for reponse in question.answers.all()]
        if questionForm.is_valid() and all([rf.is_valid() for rf in reponseForm]):
            questionModifie=questionForm.save(commit=False)
            questionModifie.save()
            lstReponsesText=request.POST.getlist('text')
            lstReponsesCorrect=request.POST.getlist('correct')
            print(lstReponsesText)
            i=0
            for form in reponseForm:
                form.save()
                if 0 <= i < len(lstReponsesText) and lstReponsesText[i] != '':
                    reponseAjoute=QuizResponse()
                    reponseAjoute.text=lstReponsesText[i]
                    if 0 <= i < len(lstReponsesCorrect):
                        if lstReponsesCorrect[i] == 'on':
                            reponseAjoute.correct = True    
                    elif i > len(lstReponsesCorrect):
                        reponseAjoute.correct = False
                    reponseAjoute.save()
                    questionModifie.answers.add(reponseAjoute)
                i+=1
            return redirect('playground:updateQuiz', request.session['currentQuiz'])
    context={
        "question_form": questionForm,
        "reponse_form": reponseForm,
    }
    return render(request, 'playground/viewQuiz.html', context)

@login_required(login_url=loginPage)
def repQuiz(request,pk):
    quiz=Quiz.objects.get(id=pk)
    questions=quiz.questions.all().order_by('numero')
    if request.method=='GET':
        if request.session["currentQuestion"]==len(questions):
            request.session["currentQuestion"]=0

        question=questions[request.session["currentQuestion"]]
        request.session["currentQuestion"]+=1
        context = {
            'quiz':quiz,
            'questions':questions,
            'question':question
            }
        if request.is_ajax():
            return render(request, 'playground/questionEnCours.html', context)
        return render(request, 'playground/repQuiz.html', context)
    return redirect('home:index')

@login_required(login_url=loginPage)
def quizChoices(request):
    try: 
        quiz = Quiz.objects.all()
        request.session["currentQuestion"]=0
        context ={
            "listquiz": quiz
        }
        return render(request, 'playground/quizChoices.html', context)
    except Quiz.DoesNotExist: 
        pass 
        return redirect('home:index')  

@login_required(login_url=loginPage)
def robot(request):
    return render(request, 'playground/robot.html')

@login_required(login_url=loginPage)
def testing(request):
    return render(request, "playground/testing.html")
