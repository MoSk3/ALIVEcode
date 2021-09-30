import { Exclude, Expose, Transform } from 'class-transformer';
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
	public name: string;

	@Expose()
	public type: IOT_COMPONENT_TYPE;

	@Expose()
	@Transform(({ value }) => {
		// Transform arrays
		if (Array.isArray(value)) {
			value = value.map(v => {
				// Transform dates
				if (v.date) v.date = new Date(v.date);
				return v;
			});
		}
		return value;
	})
	public abstract value: any;

	private componentManager: IoTComponentManager | null = null;

	public setComponentManager(componentManager: IoTComponentManager) {
		this.componentManager = componentManager;
	}

	abstract update(data: any): void;

	public getComponentManager(): IoTComponentManager | null {
		return this.componentManager;
	}
}