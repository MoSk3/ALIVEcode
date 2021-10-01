import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8888, { cors: { origin: '*' } })
export class IoTGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private logger: Logger = new Logger('IoTGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /*
  @SubscribeMessage('notification')
  notification(@MessageBody() data: string): WsResponse<string> {
    return { event: 'notification', data };
  }

  @SubscribeMessage('send_notification')
  send_notification(@MessageBody() text: string) {
    this.notificationClients.forEach(c => c.emit('notification', text));
  }

  @SubscribeMessage('register_light')
  register_light(@ConnectedSocket() client: Socket) {
    this.lightClients.push(client);
  }

  @SubscribeMessage('send_light')
  send_light(@MessageBody() light: number) {
    this.lightClients.forEach(c => c.emit('light', light));
  }*/
}