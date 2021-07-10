from django.urls import path
from home import consumers

websocket_urlpatterns = [
    path('classroom/<uuid:id>', consumers.ClassroomConsumer().as_asgi()),
]