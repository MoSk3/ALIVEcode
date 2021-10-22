import { Exclude } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

@Exclude()
export class IoTButton extends IoTComponent {
	public value: string = '';

	public type = IOT_COMPONENT_TYPE.BUTTON;

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