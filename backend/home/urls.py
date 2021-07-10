import home.views
from django.urls import path, re_path

urlpatterns = [
    path('', home.views.index, name='index'),
    path('register', home.views.register, name='register'),
    path('register_student', home.views.register_student, name='register_student'),
    path('register_professor', home.views.register_professor, name='register_professor'),
    path('login', home.views.loginPage, name='login'),
    path('logout', home.views.logoutUser, name='logout'),
    path('dashboard', home.views.dashboard, name='dashboard'),
    path('a_propos', home.views.a_propos, name='a_propos'),
    path('tests', home.views.tests, name='tests'),
    path('join_classroom', home.views.join_classroom, name='join_classroom'),
    path('create_classroom', home.views.create_classroom, name='create_classroom'),
    path('classroom/<uuid:id>', home.views.enter_classroom, name='enter_classroom'),
    path('classroom/<uuid:id>/delete', home.views.delete_classroom, name='delete_classroom'),
    path('classroom/<uuid:id>/leave', home.views.leave_classroom, name='leave_classroom'),
    
    path('create_course', home.views.create_course, name='create_course'),
    path('course/<uuid:id>', home.views.enter_course, name='enter_course'),
    path('course/<uuid:id>/<activityToPlay>', home.views.enter_course, name='enter_course'),
    path('course/<uuid:id>/delete', home.views.delete_course, name='delete_course'),
    path('course/<uuid:id>/edit', home.views.edit_course, name='edit_course'),
    path('course/<uuid:id>/edit/<sectionName>', home.views.create_section, name='create_section'),
    path('course/<uuid:id>/<sectionName>/<activityName>', home.views.enter_activity, name='enter_activity'),
    path('course/<uuid:id>/<sectionName>/<activityName>/<uuid:challengeId>', home.views.save_code, name='save_code'),
    
    path('challenges', home.views.challenges, name='challenges'),
    path('public_challenges', home.views.public_challenges, name='public_challenges'),
    path('challenge/<uuid:challengeId>', home.views.enter_challenge, name='enter_challenge'),
    path('challenge/<uuid:challengeId>/bloc', home.views.switch_to_bloc_interface, name='switch_to_bloc_interface'),
    path('challenge/<uuid:challengeId>/code', home.views.switch_to_code_interface, name='switch_to_code_interface'),
    path('challenge/<uuid:challengeId>/save', home.views.save_challenge, name='save_challenge'),
    path('challenge/<uuid:challengeId>/delete', home.views.delete_challenge, name='delete_challenge'),
    path('challenge/create', home.views.create_challenge, name='create_challenge'),
    
    path('course/<uuid:id>/<sectionName>/<activityName>/<uuid:challengeId>/success', home.views.challenge_success, name='challenge_success'),
    
    
    path('aliveScriptBook', home.views.aliveScript_book_presentation, name="aliveScript_book_presentation"),
    #path('aliveScriptBook/<chapterName>/<page>', ),
]
