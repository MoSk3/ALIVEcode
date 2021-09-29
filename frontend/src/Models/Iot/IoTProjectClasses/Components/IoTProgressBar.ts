import { IoTComponent } from '../IoTComponent';

export class IoTProgressBar extends IoTComponent {
	update(data: any): void {
		if (isNaN(data)) return;
		this.value = data;
	}
}