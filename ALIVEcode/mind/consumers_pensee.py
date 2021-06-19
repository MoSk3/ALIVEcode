import asyncio, json, re, random, io, threading
from time import sleep
from rest_framework import serializers
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import StopConsumer, DenyConnection
from mind.models import AMC, DataPoint
from home.models import User
from ALIVE.websockets.Rooms import Room, RoomClient
from asgiref.sync import sync_to_async, async_to_sync
from datetime import date
from random import randrange
import abc

# Connection du casque au serveur (par websocket)
penseeClients = {}   
class PenseeConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if 'id' in self.scope:
            self.id = self.scope['id']
            print("Casque avec id " + str(self.id) + " vient de se connecter")
            
            # Append le casque au dictionnaire
            penseeClients[self.id] = self

            await self.registerAMC()

            await self.accept()
        else:
            raise DenyConnection()
    
    @sync_to_async
    def registerAMC(self):
        try:
            self.amc = AMC.objects.get(identifier=self.id)
        except AMC.DoesNotExist:
            self.amc = AMC.objects.create(identifier=self.id)

    @sync_to_async
    def saveData(self, sensors):
        self.amc.refresh_from_db()
        if self.amc is not None:
            if self.amc.currentDataSheet is not None:
                dataPoint = DataPoint(signal_strength = sensors[0 ],
                                      attention       = sensors[1 ],
                                      meditation      = sensors[2 ],
                                      delta           = sensors[3 ],
                                      theta           = sensors[4 ],
                                      alpha_low       = sensors[5 ],
                                      alpha_high      = sensors[6 ],
                                      beta_low        = sensors[7 ],
                                      beta_high       = sensors[8 ],
                                      gamma_low       = sensors[9 ],
                                      gamma_high      = sensors[10],
                                    )
                dataPoint.save()
                self.amc.currentDataSheet.points.add(dataPoint)

    async def receive(self, text_data = None, bytes_data = None):
        # Get les données du sensor sur le casque
        if self.id not in penseeClients:
            return

        if text_data is None:
            return

        #print(text_data)

        try:
            sensors = json.loads(text_data)
        except json.JSONDecodeError:
            return

        if not isinstance(sensors, list) or len(sensors) != 11:
            return

        for val in sensors:
            if not isinstance(val, int):
                # List contiens autre chose qu'un int
                break
        else:
            await self.saveData(sensors)

            data = {
                'type': 'sensor',
                'sensor': sensors#['sensor']
            }

            if self.id in AMCDataListeners:
                for key, AMCDataListenerConsumerList in AMCDataListeners.items():
                    for consumer in AMCDataListenerConsumerList:
                        await consumer.send(text_data = json.dumps(data))

            # Renvoie les données au client connecté sur le site
            if self.id in players:
                await players[self.id].send(text_data = json.dumps(data))

                from playground.consumers_coding import convertJSONToBytes, robotClients
                if self.id in robotClients and race_started:
                    robot = robotClients[self.id]
                    speed = round(sensors[1] * 2.05 + 50) # min: 50, max: 255
                    cmd = [{"d": 0, "id": 601, "p": [speed]}]#[sensors['sensor'][1]]}]
                    #print(bytes(convertJSONToBytes(cmd)))
                    await robot.send(bytes_data = bytes(convertJSONToBytes(cmd)))
        
    async def disconnect(self, error_code):
        # print("disconnected", e)
        if hasattr(self, 'id') and self.id in penseeClients and penseeClients[self.id] == self:
            print(f'casque avec id {self.id} vient de se déconnecter')
            del penseeClients[self.id] 
  
# !-----              Gère tout ce qui se passe durant la course              -----!

nb = 0
async def RoomThread(room):
    global race_started, nb
    nb += 1
    thread_nb = nb
    while room.is_active:
        if race_started:
            players = await room.filter_clients(label="player")
            if len(players) > 0:
                race_clients_data = [player.simplify() for player in players]
                await room.send_type('update_pos', {'race_clients': race_clients_data})
        
        sleep(0.1)

race_started = False
players = {}
class PenseeGetConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global race_started

        if 'user' not in self.scope or not self.scope['user'].is_authenticated:
            raise DenyConnection()

        user = self.scope['user']

        self.room_name = 'default'
        self.group_name = f'race_{self.room_name}'
        
        room, created = await Room.get_or_create(self.room_name, self.group_name, self.channel_layer)

        if created or not room.is_active:
            await room.set_thread(RoomThread)
            await room.set_active(True)

        self.race_client = RaceClient(room=room, user=user, label='spectator')

        await self.accept()

        await room.add_client(self.race_client, self.channel_name)

        players_data = await self.get_players_info()
        if players_data is not None:
            await self.send(text_data=json.dumps({
                "type": "player_join",
                "race_clients": players_data
            }))


    async def get_players_info(self):
        players = await self.race_client.room.filter_clients(label='player')
        if len(players) > 0:
            return [player.simplify() for player in players]
        return None
  
    async def receive(self, text_data = None, bytes_data = None):
        global race_started
        if text_data is not None:
            parsed = json.loads(text_data)
            request_type = parsed.get('type', None)

            if request_type == 'connect':
                # !----   Joueur rejoint la partie avec un casque   ----!
                if 'name' not in parsed or 'amc_id' not in parsed:
                    return
                
                amc_id = parsed['amc_id']
                # Vérifie si le amc_id est apparié à un casque
                if amc_id in penseeClients: ##### À ENLEVER (not)!!!!!!!!!!!!!!!!!!!!!!!!!!
                    # S'assure que la course est bien en arrêt
                    nb_players = await self.race_client.room.get_clients_count(label="player")
                    
                    if nb_players == 0:
                        race_started = False
                    

                    # Append le client à la liste des joueur 
                    self.race_client.join_as_player(amc_id, parsed['name'], 'leader' if nb_players == 0 else 'player')
                    players[self.race_client.amc_id] = self

                    # Indique à tous les joueurs qu'un nouveau joueur vient de se connecter

                    await self.race_client.room.send_type('player_join', {'race_client': self.race_client.simplify()})

                    """await self.channel_layer.group_send(
                        self.group_name, {    
                            'type': 'player_join',
                            'race_client': self.race_client.simplify()
                        }
                    )
                    """

                else:
                    # Le amc_id du casque n'existe pas ou alors le casque n'est pas connecté
                    await self.send(text_data = json.dumps({
                        'type': 'connect_error',
                        'error': "Ce numéro d'identification n'est apparié a aucun casque"
                    }))

            elif request_type == 'update_pos' and race_started and 'x' in parsed and 'y' in parsed:
                # !----   Joueur s'est déplacé   ----!
                # Si joueur valide
                if self.race_client.isPlayer:

                    self.race_client.x = parsed['x']
                    self.race_client.y = parsed['y']
      
            elif request_type == 'start_race':
                # !----   Demande de lançage de la partie   ----!
                if self.race_client.role == 'leader':
                    race_started = True
                    # Averti les clients que la partie commence
                    await self.race_client.room.send_type('start_race')
                    cmd = [{"d": 0, "id": 101, "p": [0]}]
                    await self.send_data_to_all_robots(cmd)
            
            elif request_type == 'end_race':
                # !----   Demande d'arrêt de la partie   ----!
                if self.race_client.role == 'leader':
                    race_started = False
                    # Averti les clients que la partie est terminée
                    await self.race_client.room.send_type('end_race', {'winner': parsed.get('winner')})
                    for player in await self.race_client.room.filter_clients(label="player"):
                        player.y = -800

                    # Envoie l'arrêt d'éxécution aux robots
                    cmd = [{"d": 0, "id": 0, "p": []}]
                    await self.send_data_to_all_robots(cmd)

    async def send_data_to_all_robots(self, cmd):
        from playground.consumers_coding import convertJSONToBytes, robotClients
        for player in await self.race_client.room.filter_clients(label='player'):
            amc_id = player.amc_id
            if amc_id in robotClients:
                robot = robotClients[amc_id]
                robotData = convertJSONToBytes(cmd)
                #print(robotData)
                #print(bytes(robotData))
                await robot.send(bytes_data = bytes(robotData))

    async def player_join(self, event):
        await self.send(text_data = json.dumps(event))

    async def player_leave(self, event):
        await self.send(text_data = json.dumps(event))

    async def start_race(self, event):
        await self.send(text_data = json.dumps({
            'type': 'start_race'
        }))
    
    async def end_race(self, event):
        await self.send(text_data = json.dumps({
            'type': 'end_race',
            'winner': event.get('winner')
        }))

    async def update_pos(self, event):
        data = event.copy()
        if self.race_client.isPlayer:
            if len(data['race_clients']) <= 1:
                return
            data['race_clients'] = list(filter(lambda player: player['amc_id'] != self.race_client.amc_id, data['race_clients']))
        await self.send(text_data = json.dumps(data))

    async def disconnect(self, error_code):
        # Déconnexion d'un consumer

        if not hasattr(self, 'race_client'):
            return
        
        # Déconnexion d'un race_client
        
        await self.race_client.remove()

        if self.race_client.isPlayer:
            data = {
                'type': 'player_leave',
                'race_client': self.race_client.simplify()
            }
            # Set un nouveau leader (si le joueur l'était)

            if self.race_client.role == 'leader':
                nb_players = await self.race_client.room.get_clients_count(label="player")
                if nb_players > 0:
                    players = await self.race_client.room.filter_clients(label="player")
                    random_player = random.choice(players)
                    random_player.role = "leader"
                    data['new_leader'] = random_player.simplify()
                else:
                    race_started = False
            
            # Indique aux consumers qu'un joueur est parti
            await self.race_client.room.send(data)

        if await self.race_client.room.get_clients_count() <= 0:
            self.race_client.room.is_active = False
            self.race_client.room.delete()


        # Retrait des spectateurs
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

AMCDataListeners = {}
"""
    {
        'AMCIdentifier': [AMCDataListenerConsumer]
    }

"""
class AMCDataListener(AsyncWebsocketConsumer):
    async def connect(self):

        if 'id' in self.scope:
            self.identifier = self.scope['id']
            if await self.checkIfValidIdentifier(self.identifier):
                await self.accept()

    @sync_to_async
    def checkIfValidIdentifier(self, id):
        try:
            amc = AMC.objects.get(identifier=id)
            if amc.identifier not in AMCDataListeners:
                AMCDataListeners[amc.identifier] = []
            AMCDataListeners[amc.identifier].append(self)
        except AMC.DoesNotExist:
            return False
        return True
    
    async def disconnect(self, error_code):
        if self.identifier in AMCDataListeners and self in AMCDataListeners[self.identifier]:
            AMCDataListeners[self.identifier].remove(self)


class RaceClientSerializer(serializers.Serializer):
    amc_id = serializers.CharField(default=None, allow_null=True, max_length=30)
    isPlayer = serializers.BooleanField()
    x = serializers.IntegerField(default=0)
    y = serializers.IntegerField(default=0)
    name = serializers.CharField(default=None, allow_null=True, max_length=200)
    role = serializers.CharField(default=None, allow_null=True, max_length=20)

    def create(self, validated_data):
        race_client = RaceClient(validated_data['room'], validated_data['user'], validated_data['label'])
        if validated_data['isPlayer']:
            race_client.join_as_player(validated_data['amc_id'], validated_data['name'], validated_data['role'])
            race_client.x = validated_data['x']
            race_client.y = validated_data['y']
        return race_client


class RaceClient(RoomClient):
    serializer = RaceClientSerializer

    def __init__(self, room: Room, user: User, label: str):
        super().__init__(room, user, label)
        self.isPlayer = False
    
    def join_as_player(self, amc_id: str, name: str, role: str):
        self.amc_id = amc_id
        self.x = 0
        self.y = -800
        self.name = name
        self.role = role
        self.isPlayer = True
        self.label = 'player'

    def set_leader(self):
        self.role = 'leader'
    
        