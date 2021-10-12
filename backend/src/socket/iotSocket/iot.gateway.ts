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
import { Socket } from 'socket.io';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(8881, { cors: { origin: '*' } })
export class IoTGateway implements OnGatewayDisconnect, OnGatewayConnection, OnGatewayInit {
  private notificationClients: WebSocket[] = [];
  private lightClients: WebSocket[] = [];
  private logger: Logger = new Logger('IoTGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log(`Initialized`);
  }

  handleConnection() {
    //this.logger.log(`Client connected`);
  }

  handleDisconnect(client: WebSocket) {
    this.notificationClients = this.notificationClients.filter(cl => cl !== client);
    this.logger.log(`Client disconnected`);
  }

  @SubscribeMessage('events')
  test(@MessageBody() data: any) {
    console.log(data);
  }

  @SubscribeMessage('notification')
  notification(@MessageBody() data: string): WsResponse<string> {
    return { event: 'notification', data };
  }

  @SubscribeMessage('send_notification')
  send_notification(@MessageBody() text: string) {
    this.notificationClients.forEach(c => c.emit('notification', text));
  }

  @SubscribeMessage('register_light')
  register_light(@ConnectedSocket() client: WebSocket) {
    this.lightClients.push(client);
  }

  @SubscribeMessage('send_light')
  send_light(@MessageBody() light: number) {
    this.lightClients.forEach(c => c.emit('light', light));
  }
}