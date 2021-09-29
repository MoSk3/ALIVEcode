import { IoTComponent } from '../IoTComponent';

export class IoTProgressBar extends IoTComponent {
	private max: number = 100;
	private min: number = 0;
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