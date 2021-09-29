import { IoTComponent } from '../IoTComponent';

export class IoTButton extends IoTComponent {
	update(data: any): void {
		this.value = data;
	}
}