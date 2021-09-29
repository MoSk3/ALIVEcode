import { Socket, io } from 'socket.io-client';
import { IoTProject, IoTProjectLayout } from '../IoTproject.entity';
import { IoTComponentManager } from './IoTComponentManager';

export type IoTSocketUpdateRequest = {
	id: string;
	value: any;
};

export class IoTSocket {
	private socket: Socket;
	private iotProject: IoTProject;
	private iotComponentManager: IoTComponentManager;
	private onRender: (layout: IoTProjectLayout) => void;

	constructor(
		iotProject: IoTProject,
		onRender: (layout: IoTProjectLayout) => void,
	) {
		this.iotProject = iotProject;
		this.onRender = onRender;
		this.iotComponentManager = new IoTComponentManager(
			this.iotProject.layout,
			this.onLayoutUpdate,
			this.onRender,
		);
		this.openSocket();
	}

	private onLayoutUpdate(layout: IoTProjectLayout) {}

	public openSocket() {
		if (!process.env.REACT_APP_IOT_URL)
			throw new Error('Env variable REACT_APP_IOT_URL not set');

		this.socket = io(process.env.REACT_APP_IOT_URL);

		this.socket.on('update', this.onReceiveUpdate);
	}

	public closeSocket() {
		if (this.socket) this.socket.close();
	}

	public onReceiveUpdate(request: IoTSocketUpdateRequest) {
		this.getComponentManager()?.updateComponent(request.id, request.value);
	}

	public getComponentManager(): IoTComponentManager | null {
		return this.iotComponentManager;
	}
}