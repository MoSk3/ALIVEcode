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
    path('course/<uuid:id>/<sectionName>/<activityName>/<uuid:levelId>', home.views.save_code, name='save_code'),
    
    path('levels', home.views.levels, name='levels'),
    path('public_levels', home.views.public_levels, name='public_levels'),
    path('level/<uuid:levelId>', home.views.enter_level, name='enter_level'),
    path('level/<uuid:levelId>/bloc', home.views.switch_to_bloc_interface, name='switch_to_bloc_interface'),
    path('level/<uuid:levelId>/code', home.views.switch_to_code_interface, name='switch_to_code_interface'),
    path('level/<uuid:levelId>/save', home.views.save_level, name='save_level'),
    path('level/<uuid:levelId>/delete', home.views.delete_level, name='delete_level'),
    path('level/create', home.views.create_level, name='create_level'),
    
    path('course/<uuid:id>/<sectionName>/<activityName>/<uuid:levelId>/success', home.views.level_success, name='level_success'),
    
    
    path('aliveScriptBook', home.views.aliveScript_book_presentation, name="aliveScript_book_presentation"),
    #path('aliveScriptBook/<chapterName>/<page>', ),
]
