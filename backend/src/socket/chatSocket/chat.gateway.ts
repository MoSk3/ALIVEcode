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
  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection(client:any) {
    this.logger.log(`Client connected`);
    this.clients.push(client)
   
  }

  handleDisconnect(@ConnectedSocket() socket: WebSocket) {
    this.logger.log(`Client disconnected`);
    WatcherClient.clients = WatcherClient.watchers.filter(w => w.getSocket() !== socket);
  }

 
  // @SubscribeMessage('chatToServer')
  // handleMessage(client: WebSocket, message: { sender: string, room: string, message: string }) {
  //   this.server.to(message.room).emit('chatToClient', message);
  // }

  // @SubscribeMessage('joinRoom')
  // handleRoomJoin(client: WebSocket, room: string ) {
  //   client.join(room);
  //   client.emit('joinedRoom', room);
  // }

  // @SubscribeMessage('leaveRoom')
  // handleRoomLeave(client: WebSocket, room: string ) {
  //   client.leave(room);
  //   client.emit('leftRoom', room);
  // }
  @SubscribeMessage('k')
  handleMessage(client: WebSocket, text: string): WsResponse<string>{
    console.log(event)
    return {event: 'messageToClient', data: text}
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
  // onEvent(client: any, data: any): Observable<WsResponse<number>> {
  //   console.log(client)
  //   return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  //}
}

// @SubscribeMessage('send_message')
// onmessage(socket: WebSocket, message: string,
// ) {
//   socket.addEventListener('message', function (event) { 
//     console.log('Message from server ', event.data); 
//   });

// }
// }
