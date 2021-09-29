import { Exclude, Expose } from 'class-transformer';
import { IoTComponentManager } from './IoTComponentManager';

export enum IOT_COMPONENT_TYPE {
	BUTTON,
	PROGRESS_BAR,
	LOGS,
}

@Exclude()
export abstract class IoTComponent {
	@Expose()
	public id: string;
	@Expose()
	public value: any;
	@Expose()
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