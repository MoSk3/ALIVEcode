import { IoTComponentManager } from './IoTComponentManager';

export enum IOT_COMPONENT_TYPE {
	BUTTON,
	PROGRESS_BAR,
	LOGS,
}

export abstract class IoTComponent {
	public id: string;
	public value: any;
	public type: IOT_COMPONENT_TYPE;
	private componentManager: IoTComponentManager | null = null;

	public setComponentManager(componentManager: IoTComponentManager) {
		this.componentManager = componentManager;
	}

	abstract update(data: any): void;

	public getComponentManager(): IoTComponentManager | null {
		return this.componentManager;
	}
}