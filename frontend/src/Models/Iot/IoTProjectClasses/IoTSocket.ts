import { IoTProject, IoTProjectLayout } from '../IoTproject.entity';
import { IoTComponentManager } from './IoTComponentManager';
import { IoTComponent } from './IoTComponent';

export type IoTSocketUpdateRequest = {
	id: string;
	value: any;
};

export class IoTSocket {
	private socket: WebSocket;
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
			this.onComponentUpdate,
			(components: Array<IoTComponent>) => {
				this.iotProject.layout.components = components;
				this.onRender(this.iotProject.layout);
			},
			this,
		);
		this.openSocket();
	}

	private onComponentUpdate(layout: Array<IoTComponent>) {}

	public setOnRender(onRender: (layout: IoTProjectLayout) => void) {
		this.onRender = onRender;
	}

	public openSocket() {
		if (!process.env.REACT_APP_IOT_URL)
			throw new Error('Env variable REACT_APP_IOT_URL not set');

		if (this.socket && (this.socket.CONNECTING || this.socket.OPEN)) return;

		this.socket = new WebSocket(process.env.REACT_APP_IOT_URL);

		this.socket.onopen = () => {
			this.socket.onmessage = e => {
				const data = JSON.parse(e.data);
				switch (data.event) {
					case 'update':
						console.log(data.data);
						this.onReceiveUpdate(data.data);
						break;
				}
			};

			this.socket.send(
				JSON.stringify({
					event: 'connect_watcher',
					data: {
						iotProjectId: this.iotProject.id,
						iotProjectName: this.iotProject.name,
					},
				}),
			);
		};

		this.socket.onerror = (ev: Event) => {
			console.log(ev);
		};
	}

	public closeSocket() {
		if (this.socket) this.socket.close();
	}

	public sendData(targetId: string, actionId: number, data: string) {
		if (this.socket.OPEN) {
			this.socket.send(
				JSON.stringify({
					event: 'send_object',
					data: {
						targetId,
						actionId: Number(actionId),
						value: JSON.parse(data),
					},
				}),
			);
		}
	}

	public onReceiveUpdate(request: IoTSocketUpdateRequest) {
		this.getComponentManager()?.updateComponent(request.id, request.value);
	}

	public getComponentManager(): IoTComponentManager | null {
		return this.iotComponentManager;
	}
}