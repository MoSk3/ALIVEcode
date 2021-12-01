import { Logger, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { send } from 'process';
import {from, Observable } from 'rxjs';
import { map,  } from 'rxjs/operators';
import { Server, WebSocket } from 'ws';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserConnect } from './chat.types';
import {
  MessageRequest,
  ObjectClient,
  WatcherClient,
} from './chat.types';

@UseInterceptors(DTOInterceptor)
@WebSocketGateway(8882)
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private logger: Logger = new Logger('Chat');


  @WebSocketServer()
  server: Server;
  clients=[]
  users=[]
  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection(client:any) {
    this.logger.log(`Client connected`);
    this.clients.push(client)
        //return this.broadcast('clientConnected', client )

   
  }

  handleDisconnect(@ConnectedSocket() socket: WebSocket){
    this.logger.log(`Client disconnected`);
    WatcherClient.clients = WatcherClient.watchers.filter(w => w.getSocket() !== socket);
  }

 

  

  private broadcast(event:string, data: any):any {
    
    for (let c of this.clients) {
      c.send(
        JSON.stringify({
          event,
          data})
      )}
  }
  @SubscribeMessage('send_message')
  onMessage(@ConnectedSocket()socket:WebSocket ,@MessageBody() data:MessageRequest)  {
    
    const client = new ObjectClient(socket, data.message_user);
    client.register();
      console.log(data)
    return this.broadcast('messageToClient', data )

  }
  @SubscribeMessage('user_connected')
  onConnect(@ConnectedSocket()socket:WebSocket ,@MessageBody() data:UserConnect)  {
    
    const client = new ObjectClient(socket, data.name);
    client.register();
      this.users.push(data);
         console.log(data)
    return this.broadcast('user_connected', this.users )

  }

}

