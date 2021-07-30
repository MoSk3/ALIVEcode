import threading, json, time
from backend.functions import get_cookie
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.exceptions import DenyConnection
from asgiref.sync import async_to_sync
# Management des connections par websockets (pas ceux de la course avec la pensée,
# voir pensee_consumers pour ça)
#os.environ['JDK_HOME'] = 'C:/Users/Poste/.jdks/openjdk-15.0.1'
#os.environ['JAVA_HOME'] = '/usr/java/oracle/jdk-15.0.1'
import jnius_config
jnius_config.set_classpath('../Interpreteur/out/production/Interpreteur/artifacts/Interpreteur_jar/Interpreteur.jar')

from jnius import autoclass
clientsWithRobots = {}
# Websocket pour l'interpréteur du site
class InterpreteurConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # print("connected", e)
        await self.accept()
  
    async def receive(self, text_data=None, bytes_data=None):
        # print("received", e)
        if text_data is not None:
            parsed = json.loads(text_data)
            if 'status' in parsed:
                status = parsed['status']
                if status == 'start':
                    if 'data' in parsed:
                        # Get les lignes à exécuter
                        self.response = ""
                        self.lines = [line + "\n" for line in parsed['data']]
                        # Création d'un thread pour gérer la compilation et exécution du code
                        self.thread_alive = True
                        thread = threading.Thread(target=interpretorThread, args=[self], daemon=True)
                        thread.start()
              
                elif status == 'stop':
                    # Fin du thread
                    data = [{"d": 0, "id": 0, "p": []}]
                    if hasattr(self, 'robot_id'):
                        if(self.robot_id in robotClients):
                            robot = robotClients[self.robot_id]
                            robotData = convertJSONToBytes(data)
                            await robot.send(bytes_data = bytes(robotData))
                            #print(f'Sent to robot id : {self.robot_id} : {robotData}')
                    self.thread_alive = False
              
                elif status == 'response':
                    # Réponse quand le client a fini d'éxécuter son action
                    if 'data' in parsed:
                        if isinstance(parsed['data'], list):
                            self.response = parsed['data']
                        else:
                            self.response = []
                elif status == 'connect':
                    if 'data' in parsed:
                        id = parsed['data']
                        if isinstance(id, str):
                            if id in robotClients:
                                if id in clientsWithRobots:
                                    data = {
                                        'status': 'connect-error',
                                        'data': 'Le robot est déjà utilisé par quelqu\'un'
                                    }
                                else:
                                    #print(clientsWithRobots)
                                    data = {
                                        'status': 'connect-success',
                                        'data': ''
                                    }
                                    self.robot_id = id
                                    clientsWithRobots[id] = self
                            else:
                                data = {
                                    'status': 'connect-error',
                                    'data': 'Le robot n\'a pa pu être trouvé'
                                }
                            await self.send(text_data=json.dumps(data))
  
    @async_to_sync
    async def sendData(self, data):
        #print(f"SENDING: {data}")
        #print(data['data'])
        robotData = convertJSONToBytes(data['data'])
        #print(robotData)
        #print(bytes(robotData))
        await self.send(text_data=json.dumps(data))
        if hasattr(self, 'robot_id'):
            if data['status'] == 'compiled':
                if 'data' in data:
                    if(self.robot_id in robotClients):
                        robot = robotClients[self.robot_id]
                        #print(data['data'])
                        robotData = convertJSONToBytes(data['data'])
                        await robot.send(bytes_data = bytes(robotData))
                        """
                        await robot.send({
                            'type': 'websocket.send',
                            'text': json.dumps(data['data'])
                        })
                        """
                        #print(f'Sent to robot id : {self.robot_id} : {robotData}')
  
    async def disconnect(self, close_code):
        # print("disconnected", e)
        if hasattr(self, 'robot_id') and self.robot_id in clientsWithRobots:   
            del clientsWithRobots[self.robot_id]

def interpretorThread(client):
    # Utilisation de l'interpréteur java de mathis
    Executeur = autoclass('interpreteur.executeur.Executeur')
    Data = autoclass('interpreteur.data_manager.Data')
    DataVoiture = autoclass('interpreteur.data_manager.DataVoiture')
    # Préparation à l'exécution du code
    #print(client.lines)
    erreurs = json.loads(Executeur.compiler(client.lines, False))
    print(erreurs)
    if erreurs != []:
        client.sendData({
            'status': 'compiled',
            'data': erreurs
        })
        client.thread_alive = False
        return
    
    # Loop qui garde le thread alive 
    res = ""
    while res != None and client.thread_alive:
        # Exécute soit la première ligne du programme ou alors reprend l'exécution du code
        res = Executeur.executerMain(res != "")
      
        parsed = json.loads(res)
        if parsed is None:
            break
        client.response = None
        # Attente que le client retourne la fin de son action
        client.sendData({
            'status': 'compiled',
            'data': parsed
        })
        while client.response is None and client.thread_alive:
            time.sleep(0.1)
            pass
      
        #print("Client response:", client.response)
      
        if client.response is None:
            Executeur.arreterExecution()
            break
        
        if len(parsed) > 0 and parsed[-1]["id"] == 500:
            # Gère le renvoie de response à l'interpreteur
            if parsed[-1]["p"][0] == "car": # 1 == GET
                DataVoiture.setDataVoiture(json.dumps(client.response[0]))
                
            elif parsed[-1]["p"][0] == "read" and client.response is not None:
                Data.response.push(client.response[0])
            
        # Si fin de l'exécution break
        if not Executeur.enAction():
            break
  
    # Exécution terminée
    client.thread_alive = False
# !-----      Partie pas encore fonctionnelle (connecter robot au site)       -----!
robotClients = {}
class RobotConsumer(AsyncWebsocketConsumer):
    async def connect(self, text_data = None, bytes_data = None):
        if "id" in self.scope:
            self.id = self.scope['id']
            robotClients[self.id] = self
            print(f"robot avec id {self.id} vient de se connecter")
            await self.accept()
        else:
            raise DenyConnection()
  
    async def receive(self, text_data = None, bytes_data = None):
        # Check just in case
        if self.id in robotClients:
            if text_data is not None:
                #print(text_data)
                try:
                    parsed = json.loads(text_data)
                except json.JSONDecodeError:
                    return
                if isinstance(parsed, dict) and 'type' in parsed and parsed['type'] == 'reset':
                    # RESET
                    if self.id in clientsWithRobots:

                        # Envoie l'arrêt d'éxécution aux robots
                        cmd = [{"d": 0, "id": 0, "p": []}]
                        await self.send(bytes_data=bytes(convertJSONToBytes(cmd)))

                        delattr(clientsWithRobots[self.id], 'robot_id')
                        del clientsWithRobots[self.id]
                    #print("RESET WAS PRESSED")
                elif self.id in clientsWithRobots:
                    clientLinked = clientsWithRobots[self.id]
                    await clientLinked.send(text_data=json.dumps({
                        'status': 'robot-data',
                        'data': parsed
                    }))
      
    async def disconnect(self, error_code):
        # print("disconnected", e)
        if hasattr(self, 'id') and self.id in robotClients and robotClients[self.id] == self:
            print(f"robot avec id {self.id} vient de se déconnecter")
            del robotClients[self.id]

intToBytesCmds = {
    0  : 'X', # Arrêt complet
    100: 's', # Arreter
    101: 'f', # Avancer
    102: 'b', # Reculer
    103: 't', # Tourner
    107: 'T', # Go To Angle
    301: 'w', # Attendre
    601: 'v', # Set Vitesse
}

def convertJSONToBytes(json: list):
    my_bytes = bytearray('', encoding='ISO-8859-1')
    for cmd in json:
        val = None
        cmdId = cmd['id']
        if cmdId in intToBytesCmds:
            id = intToBytesCmds[cmdId]
            my_bytes.append(ord(id))
            cmdP = cmd['p']
            if cmdId != 0 and cmdId != 100:
                num = int(cmdP[0]) if type(cmdP[0]) == str else cmdP[0]
                convertNumberToBytes(num, my_bytes)
            
        elif cmdId == 104 or cmdId == 105:
            id = intToBytesCmds[103]
            my_bytes.append(ord(id))
            num = -90 if cmdId == 104 else 90
            convertNumberToBytes(num, my_bytes)

        elif cmdId == 106:
            motorLeft  = int(cmd['p'][0])
            motorRight = int(cmd['p'][1])
            my_bytes.append(ord('g'))
            convertNumberToBytes(motorLeft, my_bytes)
            my_bytes.append(ord('d'))
            convertNumberToBytes(motorRight, my_bytes)

    return my_bytes


def convertNumberToBytes(num: int, my_bytes: bytearray):
    if num < 0:
        my_bytes.append(ord('n'))
    else:
        my_bytes.append(ord('p'))
    absNum = int(abs(num))
    if absNum >= 256:
        my_bytes.append(4) # Number of bytes
        #cmdP[0].to_bytes(4, byteorder="big", signed=True)
        my_bytes.append((absNum >> 24) % 256)
        my_bytes.append((absNum >> 16) % 256)
        my_bytes.append((absNum >> 8 ) % 256)
        my_bytes.append( absNum        % 256)
        #val = num.to_bytes(2, byteorder="little", signed=True).decode("ascii")
    else:
        my_bytes.append(1)
        my_bytes.append(absNum)
    #return my_bytes.decode('ISO-8859-1')
