from mind.views import index, fonctionnement, race, analyze, analyze_disconnect, delete_datasheet, clear_datasheet, record_datasheet
from django.urls import path

urlpatterns = [
    path('', index, name='index'),
    path('fonctionnement', fonctionnement, name='fonctionnement'),
    path('race', race, name='race'),
    path('analyze', analyze, name='analyze'),
    path('analyze/disconnect', analyze_disconnect, name='analyze_disconnect'),
    path('analyze/delete', delete_datasheet, name='delete_datasheet'),
    path('analyze/clear', clear_datasheet, name='clear_datasheet'),
    path('analyze/record', record_datasheet, name='record_datasheet'),
]
