from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import DenyConnection
from channels.exceptions import StopConsumer
from asgiref.sync import sync_to_async
# from playground.models import IOTObject
import json

class IOTConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if 'id' in self.scope:
            self.identifier = self.scope['id']
            if await self.checkIfValidIdentifier(self.identifier):
                await self.accept()
            else:
                raise DenyConnection()
        else:
            raise DenyConnection()

    async def receive(self, text_data = None, bytes_data = None):
        if text_data is not None:
            try:
                data = json.loads(e["text"])
                """
                {
                    "text": "ping"
                }
                """

                if "text" in data:

                    msg = data["text"]
                    print(msg)

                    await self.send(text_data = json.dumps([
                        {
                            "protocol_id": 10,
                            "params": ["OUUUUUUH"]
                        },
                        {
                            "protocol_id": 20,
                            "params": ["aaaaaa"]
                        },
                        {
                            "protocol_id": 69,
                            "params": ["mathis", "est", "un", "caca"]
                        }
                    ]))

            except json.JSONDecodeError:
                pass



    @sync_to_async
    def checkIfValidIdentifier(self, id):
        """
        try:
            self.iot = IOTObject.objects.get(id=id)
        except IOTObject.DoesNotExist:
            return False
        return True
        """
        pass
    
    async def disconnect(self, error_code):
        pass
