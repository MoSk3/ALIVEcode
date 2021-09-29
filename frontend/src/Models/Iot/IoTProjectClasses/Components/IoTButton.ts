import { Exclude } from 'class-transformer';
import { IoTComponent } from '../IoTComponent';

@Exclude()
export class IoTButton extends IoTComponent {
	public value: string = '';

	update(data: any): void {
		this.value = data;
	}
}