import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
os.environ.setdefault("DJANGO_ALLOW_ASYNC_UNSAFE", "true")

django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url

from backend.middleware import QueryAuthMiddlewareStack

import home.routing

from playground.consumers_coding import InterpreteurConsumer, RobotConsumer
from playground.consumers_iot import IOTConsumer
from mind.consumers_pensee import PenseeConsumer, PenseeGetConsumer, AMCDataListener

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": QueryAuthMiddlewareStack(
        URLRouter(
            [
                url('mind/race/get', PenseeGetConsumer.as_asgi()),
                url('mind/analyze/get', AMCDataListener.as_asgi()),
                url('playground/pensee', PenseeConsumer.as_asgi()),
                url('iot', IOTConsumer.as_asgi()),
                url('robot', RobotConsumer.as_asgi()),
                url('playground', InterpreteurConsumer.as_asgi()),
                *home.routing.websocket_urlpatterns,
            ]
        )  
    )
})