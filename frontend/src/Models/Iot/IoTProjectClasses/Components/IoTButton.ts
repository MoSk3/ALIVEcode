import { Exclude, Expose } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

@Exclude()
export class IoTButton extends IoTComponent {
	public value: string = '';
	public type = IOT_COMPONENT_TYPE.BUTTON;

	@Expose()
	public targetId?: string | null = null;

	@Expose()
	public actionId: number = 0;

	@Expose()
	public actionData: string = '';

	public setTargetId(id: string) {
		this.targetId = id;
		this.getComponentManager()?.render();
	}

	public setActionId(id: number) {
		this.actionId = id;
		this.getComponentManager()?.render();
	}

	public setActionData(data: string) {
		this.actionData = data;
		this.getComponentManager()?.render();
	}

	public onClick() {
		if (this.targetId != null)
			this.getComponentManager()
				?.getSocket()
				.sendData(this.targetId, this.actionId, this.actionData);
	}

	update(data: any): void {
		this.value = data;
	}
}

export const createDefaultIoTButton = () => {
	const progress = new IoTButton();
	progress.value = 'Click me';
	progress.name = 'Default Button';
	progress.id = '';

	return progress;
};