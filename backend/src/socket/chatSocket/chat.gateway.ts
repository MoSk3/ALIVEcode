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
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import {
  WatcherClient,
} from './chat.types';

@UseInterceptors(DTOInterceptor)
@WebSocketGateway(8882)
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private logger: Logger = new Logger('IoTGateway');


  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection() {
    this.logger.log(`Client connected`);
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
}
