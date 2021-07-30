import json
import random
import string
from typing import List, Union
from django.http.response import JsonResponse
from django.shortcuts import render, redirect, HttpResponseRedirect
from django.template.loader import render_to_string
from django.http import HttpResponse, HttpRequest
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from home.forms import StudentCreationForm, ProfessorCreationForm
from playground.forms import LevelCreationForm, ClassroomCreationForm, CourseCreationForm
from playground.models import ActivityProgression, Level, Classroom, Course, Activity, Section, LevelProgression, SimulationLevel, SimulationLevelProgression
from home.models import Professor, Student, User
from datetime import datetime

loginPageUrl = '/login'


# Create your views here.


def index(request: HttpRequest):
    return render(request, 'home/index.html')

def register(request: HttpRequest):
    if request.user.is_authenticated:
        return redirect('home:dashboard')

    return render(request, 'home/register.html')


def register_student(request: HttpRequest):
    if request.user.is_authenticated:
        return redirect('home:dashboard')

    form = StudentCreationForm()

    if request.method == 'POST':
        form = StudentCreationForm(request.POST)
        if form.is_valid():
            user: Student = form.save(commit=True)

            messages.success(
                request, f'Un compte a été créé pour {user.email}')
            login(request, user)
            return redirectWithNext('home:login', request.GET.get('next'))

    return render(request, 'home/register_student.html', {
        'form': form
    })


def register_professor(request: HttpRequest):
    if request.user.is_authenticated:
        return redirect('home:dashboard')

    form = ProfessorCreationForm()

    if request.method == 'POST':
        form = ProfessorCreationForm(request.POST)
        if form.is_valid():
            user: Professor = form.save(commit=True)

            messages.success(
                request, f'Un compte a été créé pour {user.email}')
            login(request, user)
            return redirectWithNext('home:login', request.GET.get('next'))

    return render(request, 'home/register_professor.html', {
        'form': form
    })


def loginPage(request: HttpRequest) -> HttpResponseRedirect:
    nextUrl = request.GET.get('next')

    if request.user.is_authenticated:
        if nextUrl is not None:
            return redirect(nextUrl)
        return redirectToPreviousPage(request)

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, email=email, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                if nextUrl is not None:
                    return redirect(nextUrl)
                return redirect('home:dashboard')
        else:
            messages.error(request, 'Username ou Password invalide')
            return redirectWithNext('home:login', nextUrl)
    return render(request, 'home/login.html')


def logoutUser(request: HttpRequest) -> HttpResponseRedirect:
    logout(request)
    return redirect('home:index')


@login_required(login_url=loginPageUrl)
def dashboard(request: HttpRequest) -> HttpResponse:
    if request.user.isProfessor():
        return render(request, 'home/dashboard_professor.html', {
            'classrooms': Classroom.objects.filter(creator=request.user.professor),
            'courses': Course.objects.filter(creator=request.user.professor)
        })
    return render(request, 'home/dashboard.html', {
        'classrooms': request.user.student.classroom_set.all(),
        'courses': request.user.student.courses.all()
    })


def a_propos(request: HttpRequest) -> HttpResponse:
    return render(request, 'home/a_propos.html')


def tests(request: HttpRequest) -> HttpResponse:
    return render(request, "home/tests.html")


@login_required(login_url="home:register_student")
def join_classroom(request: HttpRequest) -> HttpResponse:
    if not request.user.isStudent():
        return redirectToPreviousPage(request)

    code = None
    if request.method == 'POST':
        code = request.POST.get('code')
    elif request.method == 'GET':
        code = request.GET.get('code')
    if code is not None:
        try:
            classroom: Classroom = Classroom.objects.get(code=code)
            classroom.students.add(request.user.student)
            return redirect('home:enter_classroom', classroom.id)
        except Classroom.DoesNotExist:
            messages.error(
                request, f"Il n'existe aucune classe avec le code {code}")
    return render(request, "home/join_classroom.html")


@login_required(login_url=loginPageUrl)
def create_classroom(request: HttpRequest) -> HttpResponse:
    if not request.user.isProfessor():
        return redirectToPreviousPage(request)

    form = ClassroomCreationForm()

    if request.method == 'POST':
        form = ClassroomCreationForm(request.POST)
        if form.is_valid():
            classroom: Classroom = form.save(commit=False)
            classroom.creator = request.user.professor
            classroom.code = ''.join(random.choices(
                string.ascii_letters + string.digits, k=6))
            classroom.save()
            return redirect('home:enter_classroom', classroom.id)
    return render(request, "home/create_classroom.html", {
        'form': form
    })


@login_required(login_url=loginPageUrl)
def delete_classroom(request: HttpRequest, id) -> HttpResponseRedirect:
    if not request.user.isProfessor():
        return redirectToPreviousPage(request)
    try:
        classroom: Classroom = Classroom.objects.get(id=id)
    except Classroom.DoesNotExist:
        return redirect('home:dashboard')
    if classroom.creator == request.user.professor:
        classroom.delete()
        return redirect('home:dashboard')
    return redirect('home:dashboard')


@login_required(login_url=loginPageUrl)
def leave_classroom(request: HttpRequest, id) -> HttpResponse:
    try:
        classroom: Classroom = Classroom.objects.get(id=id)
    except Classroom.DoesNotExist:
        return redirect('home:dashboard')

    if request.user.isProfessor():
        if classroom.creator == request.user.professor:
            messages.error(request, "Tu ne peux pas quitter ta propre classe")
        return redirectToPreviousPage(request)

    if not request.user.student.classroom_set.filter(id=id).exists():
        return redirect('home:dashboard')
    classroom.students.remove(request.user.student)
    return redirect('home:dashboard')


@login_required(login_url=loginPageUrl)
def enter_classroom(request: HttpRequest, id) -> HttpResponse:
    try:
        classroom: Classroom = Classroom.objects.get(id=id)
    except Classroom.DoesNotExist:
        return redirect('home:dashboard')
    if request.user.isProfessor() and classroom.creator != request.user.professor:
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

    if request.user.isStudent() and not request.user.student.classroom_set.filter(id=id).exists():
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    return render(request, "home/classroom.html", {
        'classroom': classroom,
    })


def redirectWithNext(redirectPathName: str, nextUrl: str) -> HttpResponseRedirect:
    if nextUrl is not None:
        response = redirect(redirectPathName)
        response['Location'] += f'?next={nextUrl}'
        return response
    return redirect(redirectPathName)


def redirectToPreviousPage(request: HttpRequest) -> HttpResponseRedirect:
    return HttpResponseRedirect(request.META.get('HTTP_REFERER', '/'))


# ------------- COURS ------------------------- #

@login_required(login_url=loginPageUrl)
def create_course(request: HttpRequest) -> HttpResponse:
    form = CourseCreationForm()

    if request.method == 'POST':
        form = CourseCreationForm(request.POST)
        if form.is_valid():
            course: Course = form.save(commit=False)
            course.creator = request.user.professor
            course.code = ''.join(random.choices(
                string.ascii_letters + string.digits, k=10))
            course.save()
            return redirect('home:enter_course', course.id)
    return render(request, "home/create_course.html", {
        'form': form
    })


@login_required(login_url=loginPageUrl)
def delete_course(request: HttpRequest, id) -> HttpResponseRedirect:
    if not request.user.isProfessor():
        return redirectToPreviousPage(request)
    try:
        course: Course = Course.objects.get(id=id, creator=request.user.professor)
        course.delete()
        return redirect('home:dashboard')
    except Course.DoesNotExist:
        pass

    return redirect('home:dashboard')


@login_required(login_url=loginPageUrl)
def enter_course(request: HttpRequest, id, activityToPlay=None) -> HttpResponse:
    try:
        course: Course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return redirect('home:dashboard')

    if not request.user.isProperty(course, "creator") and course.access == "PR":
        return redirectToPreviousPage(request)

    elif course.access == "RE" and not any(classroom.courses_set.filter(id=course.id).exists() for classroom in
                                           request.user.student.classroom_set.all()):
        return redirectToPreviousPage(request)

    return render(request, "home/course.html", {
        'course': course,
        'chosenActivity': activityToPlay
    })


@login_required(login_url=loginPageUrl)
def edit_course(request: HttpRequest, id) -> HttpResponse:
    if not request.user.isProfessor():
        return redirectToPreviousPage(request)
    try:
        course: Course = Course.objects.get(id=id, creator=request.user.professor)
        return render(request, "coursEditor/course_editor.html", {
            'course': course
        })
    except Course.DoesNotExist:
        pass
    return redirect('home:dashboard')


@login_required(login_url=loginPageUrl)
def create_section(request: HttpRequest, id, sectionName) -> HttpResponse:
    try:
        course: Course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return redirect('home:dashboard')

    if not request.user.isProperty(course, "creator"):
        return redirectToPreviousPage(request)

    section = course.section_set.filter(name=sectionName)

    if not section.exists() and request.is_ajax():
        section = Section()
        section.name = sectionName
        section.course = course
        section.save()
        context = {
            'course': course
        }
        html = render_to_string('coursEditor/course_editor.html', context)
        return HttpResponse(html)
    return redirect('home:enter_course', id=course.id)


@login_required(login_url=loginPageUrl)
def enter_activity(request: HttpRequest, id, sectionName, activityName) -> HttpResponse:
    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return redirect('home:dashboard')

    if not request.user.isProperty(course, "creator"):
        if course.access == "PR":
            return redirectToPreviousPage(request)

    section = course.section_set.filter(name=sectionName)
    if not section.exists():
        if request.is_ajax():
            return HttpResponse('')
        return redirect('home:enter_course', id=course.id)

    section = section.first()

    try:
        activity = Activity.objects.get(name=activityName, section=section)
    except Activity.DoesNotExist:
        return redirect('home:enter_course', id=course.id)

    try:
        progression = ActivityProgression.objects.get(
            activity=activity, user=request.user)
        progression.update_completion()

    except ActivityProgression.DoesNotExist:
        progression = ActivityProgression.objects.create(activity=activity, user=request.user, date=datetime.now(),
                                                         state=activity.starting_state)

    if progression.state == "locked":
        return HttpResponse(
            'Tu ne peux pas accéder à cette activité encore, car tu n\'as pas fini l\'activité précédente!')

    for level in activity.levels.all():
        if not progression.level_progressions.filter(level=level).exists():
            level_prog = LevelProgression.objects.create(
                level=level, user=request.user, date=datetime.now())

            if SimulationLevel.objects.filter(level=level).exists():
                level_dict = json.loads(level.type.level)
                initial_code = "\n".join(level_dict["initial_code"])
                SimulationLevelProgression.objects.create(
                    level_progression=level_prog,
                    code=initial_code)

                progression.level_progressions.add(level_prog)

    for prog_level in progression.level_progressions.all()[:]:
        if not activity.levels.filter(type=prog_level.level.type).exists():
            prog_level.delete()

    context = {
        'activity': activity,
        'activity_progression': progression
    }

    if request.is_ajax():
        html = render_to_string('modules/activity.html', context)
        return HttpResponse(html)
    return render(request, 'modules/activity.html', context)


@login_required(login_url=loginPageUrl)
def save_code(request: HttpRequest, id, sectionName, activityName, levelId) -> HttpResponse:
    if not request.is_ajax():
        return redirect('home:dashboard')

    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return redirect('home:dashboard')

    if not request.user.isProperty(course, "creator"):
        if course.access == "PR":
            return redirectToPreviousPage(request)

    section = course.section_set.filter(name=sectionName)
    if not section.exists():
        return redirect('home:enter_course', id=course.id)

    section = section.first()

    try:
        activity = Activity.objects.get(name=activityName, section=section)
    except Activity.DoesNotExist:
        return redirect('home:enter_course', id=course.id)

    progression = ActivityProgression.objects.get(
        activity=activity, user=request.user)

    progression.level_progressions.get(level=Level.objects.get(
        id=levelId)).alive_level_progression.update_code(request.POST.get("code"))

    progression.update_completion()

    context = {
        'activity': activity,
        'activity_progression': progression
    }

    html = render_to_string('modules/activity.html', context)
    return HttpResponse(html)


@login_required(login_url=loginPageUrl)
def level_success(request: HttpRequest, id, sectionName, activityName, levelId) -> HttpResponse:
    if not request.is_ajax():
        return redirect('home:dashboard')

    try:
        course = Course.objects.get(id=id)
    except Course.DoesNotExist:
        return redirect('home:dashboard')

    if not request.user.isProperty(course, "creator"):
        if course.access == "PR":
            return redirectToPreviousPage(request)

    section = course.section_set.filter(name=sectionName)
    if not section.exists():
        return redirect('home:enter_course', id=course.id)

    section = section.first()

    try:
        activity = Activity.objects.get(name=activityName, section=section)
    except Activity.DoesNotExist:
        return redirect('home:enter_course', id=course.id)

    progression: ActivityProgression = ActivityProgression.objects.get(
        activity=activity, user=request.user)
    level_prog: LevelProgression = progression.level_progressions.get(
        level=Level.objects.get(id=levelId))

    level_prog.state = "completed"
    level_prog.alive_level_progression.solutions = json.dumps(
        json.loads(level_prog.alive_level_progression.solutions).append(level_prog.alive_level_progression.code))
    level_prog.save(force_update=True)

    progression.update_completion()

    activityUnlock = unlock_next_activity(course, activity, request.user)

    context = {
        'activityUnlock': activityUnlock.id if activityUnlock is not None else None,
        'html': f"{activity.name} {progression.get_nb_levels_completed()}/{progression.get_nb_levels()}"
    }

    return JsonResponse(context)


def unlock_next_activity(course: Course, activity: Activity, user: User) -> Union[None, Activity]:
    sect_lst = course.section_set
    is_next = False
    unlock = None
    activityUnlock = None
    for sect in sect_lst.all():
        if unlock is None:
            act_lst = Activity.objects.filter(section=sect)
            for act in act_lst.all():
                if is_next:
                    try:
                        unlock: ActivityProgression = ActivityProgression.objects.get(activity=act, user=user)
                    except ActivityProgression.DoesNotExist:
                        unlock: ActivityProgression = ActivityProgression.objects.create(activity=act, user=user,
                                                                                         date=datetime.now(),
                                                                                         state=act.starting_state)
                    activityUnlock = act
                    break
                is_next = act == activity
    if unlock is not None and unlock.state == "locked":
        unlock.state = "unlocked"
        unlock.save(force_update=True)

    return activityUnlock


@login_required(login_url=loginPageUrl)
def levels(request: HttpRequest) -> HttpResponse:
    return render(request, 'home/levels.html', {
        "levels": Level.objects.filter(creator=request.user)
    })


@login_required(login_url=loginPageUrl)
def public_levels(request: HttpRequest) -> HttpResponse:
    return render(request, 'home/public_levels.html', {
        "levels": Level.objects.filter(access="PU")
    })


@login_required(login_url=loginPageUrl)
def enter_level(request: HttpRequest, levelId) -> HttpResponse:
    try:
        level: Level = Level.objects.get(id=levelId)
    except Level.DoesNotExist:
        return redirect('home:dashboard')

    creator = 0
    if request.user == level.creator:
        creator = 1
    elif level.access == "PR":
        return redirectToPreviousPage(request)

    return render(request, "playground/code.html", {
        'level': level,
        'creator': creator
    })


@login_required(login_url=loginPageUrl)
def create_level(request: HttpRequest) -> HttpResponseRedirect:
    level = Level.objects.create(creator=request.user)
    aliveLevel = SimulationLevel.objects.create(level=level)
    return redirect('home:enter_level', levelId=level.id)
    """
    if request.method == 'POST':
        level = Level.objects.create(creator=request.user, name=request.POST['nameLevel'])   
        aliveLevel = ALIVELevel.objects.create(level=level)
        return HttpResponse()
    return HttpResponse('')
    """
    """
    form = LevelCreationForm()

    if request.method == 'POST':
        form = LevelCreationForm(request.POST)
        if form.is_valid():
            level = form.save(commit=False)
            level.creator = request.user
            level.save()
            return redirect('home:enter_course', level.id)
    return render(request, "home/create_level.html", {
        'form': form
    })
    """


@login_required(login_url=loginPageUrl)
def save_level(request: HttpRequest, levelId) -> HttpResponse:
    if not request.is_ajax() or request.method != "POST":
        return redirect('home:dashboard')
    try:
        level: Level = Level.objects.get(id=levelId, creator=request.user)
    except Level.DoesNotExist:
        return HttpResponse('error level does not exist')

    aliveLevel = level.type

    level = request.POST.get("level_data")
    if level is None:
        return HttpResponse('error level is none')

    levelName = request.POST.get("levelName")
    if levelName is None or levelName == "":
        levelName = "Sans nom"

    levelAccess = request.POST.get("levelAccess")
    if levelAccess is None:
        return HttpResponse('error levelAccess is none')

    aliveLevel.level = level
    aliveLevel.save(force_update=True)

    level.name = levelName
    level.access = levelAccess
    level.save()

    return HttpResponse('success')


@login_required(login_url=loginPageUrl)
def delete_level(request: HttpRequest, levelId) -> HttpResponse:
    try:
        level: Level = Level.objects.get(id=levelId, creator=request.user)
        level.delete()
        return HttpResponse('success')
    except Level.DoesNotExist:
        return HttpResponse('error level does not exist')


@login_required(login_url=loginPageUrl)
def switch_to_bloc_interface(request: HttpRequest, levelId) -> HttpResponse:
    try:
        level: Level = Level.objects.get(id=levelId)
    except Level.DoesNotExist:
        return redirect('home:dashboard')

    if request.user != level.creator and level.access == "PR":
        return redirectToPreviousPage(request)

    return render(request, "playground/blocs.html", {"level": level})


@login_required(login_url=loginPageUrl)
def switch_to_code_interface(request: HttpRequest, levelId) -> HttpResponse:
    if request.is_ajax() and request.method == "POST":
        try:
            level = Level.objects.get(id=levelId)
        except Level.DoesNotExist:
            pass

        return render_to_string("modules/line_interface.html", {"level": level or None})
    else:
        return redirect('home:enter_level', levelId=levelId)



@login_required(login_url=loginPageUrl)
def aliveScript_book_presentation(request: HttpRequest):
    return render(request, "aliveScriptManual/presentation.html", {})

@login_required(login_url=loginPageUrl)
def aliveScript_book_page(request: HttpRequest, chapterName, page):
    pass



