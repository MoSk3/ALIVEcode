import { Exclude, Expose } from 'class-transformer';
import { IoTComponent } from '../IoTComponent';

@Exclude()
export class IoTProgressBar extends IoTComponent {
	public value: number;
	@Expose()
	private max: number = 100;
	@Expose()
	private min: number = 0;
	@Expose()
	public isPercentage: boolean = true;

	update(data: any): void {
		if (isNaN(data)) return;
		this.value = data;
	}

	public setRange(min: number, max: number) {
		this.min = min;
		this.max = max;

		this.getComponentManager()?.render();
	}

	public getMin(): number {
		return this.min;
	}

	public getMax(): number {
		return this.max;
	}
}