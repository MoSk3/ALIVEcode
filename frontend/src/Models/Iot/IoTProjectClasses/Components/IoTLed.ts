import { Exclude } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

export enum LED_STATE {
	ON,
	OFF,
}

@Exclude()
export class IoTLed extends IoTComponent {
	public value: LED_STATE = LED_STATE.OFF;
	public type = IOT_COMPONENT_TYPE.LED;

	setValue(val: boolean) {
		super.setValue(val ? LED_STATE.ON : LED_STATE.OFF);
	}

	update(data: any): void {
		this.value = data;
	}
}

export const createDefaultIoTLed = () => {
	const progress = new IoTLed();
	progress.value = LED_STATE.ON;
	progress.name = 'Default LED';
	progress.id = '';

	return progress;
};