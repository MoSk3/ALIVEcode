import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8888, { cors: { origin: '*' } })
export class IoTGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private notificationClients: Socket[] = [];
  private logger: Logger = new Logger('IoTGateway');

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log(`Initialized`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.notificationClients.push(client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.notificationClients = this.notificationClients.filter(cl => cl !== client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notification')
  notification(@MessageBody() data: string, @ConnectedSocket() client: Socket): WsResponse<string> {
    return { event: 'notification', data };
  }

  @SubscribeMessage('send_notification')
  send_notification(@MessageBody() text: string) {
    this.notificationClients.forEach(c => c.emit('notification', text));
  }
}