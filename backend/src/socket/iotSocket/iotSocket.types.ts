import { WebSocket } from 'ws';

export type IoTSocketUpdateRequest = {
  id: string;
  value: any;
  projectId: string;
};

export type IoTSocketUpdateRequestWatcher = {
  id: string;
  value: any;
};

export class Client {
  static clients: Client[] = [];

  constructor(private socket: WebSocket) {}

  register() {
    Client.clients.push(this);
  }

  getSocket() {
    return this.socket;
  }

  sendCustom(event: string, data: any) {
    this.socket.send(JSON.stringify({ event, data }));
  }

  removeSocket() {
    if (this instanceof WatcherClient) {
      WatcherClient.watchers = WatcherClient.watchers.filter(w => w.socket !== this.socket);
    } else if (this instanceof ObjectClient) {
      ObjectClient.clients = ObjectClient.clients.filter(w => w.socket !== this.socket);
    }
    Client.clients = Client.clients.filter(w => w.socket !== this.socket);
  }

  static getClientBySocket(socket: WebSocket) {
    return Client.clients.find(c => c.socket === socket);
  }
}

export class WatcherClient extends Client {
  static watchers: WatcherClient[] = [];
  private projectId: string;

  constructor(socket: WebSocket, projectId: string) {
    super(socket);
    this.projectId = projectId;
  }

  register() {
    super.register();
    WatcherClient.clients.push(this);
  }

  static getClientBySocket(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket);
  }

  static getClientsByProject(projectId: string) {
    return WatcherClient.watchers.filter(w => w.projectId === projectId);
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return WatcherClient.watchers.find(w => w.getSocket() === socket) != null;
  }

  sendUpdate(updateData: IoTSocketUpdateRequest) {
    this.sendCustom('update', updateData);
  }
}

export class ObjectClient extends Client {
  static clients: ObjectClient[] = [];
  private id: string;
  private projectRights: string[];

  constructor(socket: WebSocket, id: string, projectRigths: string[]) {
    super(socket);
    this.id = id;
    this.projectRights = projectRigths;
  }

  register() {
    super.register();
    ObjectClient.clients.push(this);
  }

  static getClientBySocket(socket: WebSocket) {
    return ObjectClient.clients.find(w => {
      return w.getSocket() === socket;
    });
  }

  static isSocketAlreadyWatcher(socket: WebSocket) {
    return ObjectClient.clients.find(w => w.getSocket() === socket) != null;
  }

  sendUpdate(updateData: IoTSocketUpdateRequest) {
    const watchers = WatcherClient.getClientsByProject(updateData.projectId);

    const data: IoTSocketUpdateRequestWatcher = {
      id: updateData.id,
      value: updateData.value,
    };

    watchers.forEach(w => w.sendCustom('update', data));
  }
}

export type WatcherClientConnectPayload = {
  iotProjectName: string;
  iotProjectId: string;
};

export type ObjectClientConnectPayload = {
  id: string;
};