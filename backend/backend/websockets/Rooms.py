import json, threading, asyncio
from rest_framework.renderers import JSONRenderer 
from rest_framework.parsers import JSONParser


class Room:
    objects = []
    def __init__(self, name: str, group_name: str, channel_layer, clients: list = None):
        self.name = name
        self.is_active = False
        self.group_name = group_name
        self.channel_layer = channel_layer
        if clients is None:
            self.clients = []
        else:
            self.clients = clients
        Room.objects.append(self)

    async def set_active(self, is_active:bool):
        if not hasattr(self, 'room_thread'):
            raise Exception("Aucun room thread assigné, utiliser set_thread(<async def>)")
        self.is_active = is_active
        if is_active:

            _thread = threading.Thread(target=asyncio.run, args=(self.room_thread(self),))
            _thread.start()

            #thread = threading.Thread(target=self.room_thread, args=[self], daemon=True)
            #thread.start()

    async def set_thread(self, thread):
        self.room_thread = thread

    @classmethod
    async def get_room(cls, name:str, group_name:str, channel_layer):
        rooms = list(filter(lambda room: room.name == name and room.group_name == group_name and room.channel_layer == channel_layer, Room.objects))
        return rooms[0] if len(rooms) > 0 else None

    @classmethod
    async def get_or_create(cls, name: str, group_name:str, channel_layer):
        created = False
        room = await Room.get_room(name, group_name, channel_layer)
        if room is None:
            room = Room(name, group_name, channel_layer)
            created = True
        return (room, created)

    async def send_type(self, type:str, data:dict = None):
        if data is None:
            data = {}
        data['type'] = type
        
        await self.channel_layer.group_send(
            self.group_name, data
        )

    async def send(self, data:dict):
        await self.channel_layer.group_send(
            self.group_name, data
        )

    async def add_client(self, client, channel_name):
        self.clients.append(client)
        await self.channel_layer.group_add(
            self.group_name,
            channel_name
        )

    async def remove_client(self, client):
        self.clients.remove(client)

    async def filter_clients(self, **kwargs):
        return [client for client in self.clients if all(getattr(client, k) == v for k, v in kwargs.items())]

    async def get_clients_count(self, **kwargs):
        return len(await self.filter_clients(**kwargs))

    async def delete(self):
        Room.objects.remove(self)
        

class RoomClient:
    def __init__(self, room: Room, user, label: str):
        self.room = room
        self.user = user
        self.label = label
    
    def __init_subclass__(cls):
        if not getattr(cls, "serializer"):
            raise AttributeError("You must implement a serializer in subclass")

    @classmethod
    def parse(cls, json, room: Room, user, label: str):
        stream = io.BytesIO(json)
        data = JSONParser().parse(stream)
        serializer = cls.serializer(data = data)
        if serializer.is_valid():
            room_client = serializer.save(room = room, user=user, label = label)
            room_client.room = room
            return room_client

    def simplify(self):
        serializer = self.serializer(self)
        data = JSONRenderer().render(serializer.data).decode('ascii')
        return json.loads(data)

    def serialize(self, decode = True):
        serializer = self.serializer(self)
        if decode:
            return JSONRenderer().render(serializer.data).decode('ascii')
        else:
            return JSONRenderer().render(serializer.data)

    async def remove(self):
        if self.room is None:
            raise Exception('Aucune salle assignée')
        if self.user is None:
            raise Exception('Aucun user assigné')
        await self.room.remove_client(self)

    """
    @sync_to_async
    def save(self):
        if self.room is None:
            raise Exception('Aucune salle assignée')
        if self.user is None:
            raise Exception('Aucun client assigné')
        custom_clients = self.room.custom_clients.filter(client = self.user)
        if not custom_clients.exists():
            custom_client = async_to_sync(self.room.create_and_add_client)(client = self.user, label = self.label, data = self.serialize())
        else:
            custom_client = custom_clients.first()
            custom_client.data = self.serialize()
            custom_client.label = self.label
            custom_client.save()
        return custom_client.data
    """

    def __repr__(self):
        return f"RoomClient[room=[{self.room}], client=[{self.user}], data={self.serialize()}]]"


"""
class Customclient(models.Model):
    client  = models.ForeignKey('home.client', on_delete=models.CASCADE)
    
    label = models.CharField(default="", max_length=100)
    data  = models.TextField(default='{}', max_length=1000000)

    def get_field(self, field):
        parsed_data = self.get_parsed()
        if parsed_data is None:
            return None
        return parsed_data.get(field)

    def get_parsed(self):
        try:
            return json.loads(self.data)
        except json.JSONDecodeError:
            return None
    
    def dump(self, data):
        try:
            self.data = json.dumps(data)
            self.save()
            return True
        except:
            return False
"""