import { Exclude } from 'class-transformer';
import { IoTComponent } from '../IoTComponent';

export type IoTLogModel = {
	date: Date;
	text: string;
};

export type IoTLogsModel = Array<IoTLogModel>;

@Exclude()
export class IoTLogs extends IoTComponent {
	public value: IoTLogsModel = [];

	update(data: any): void {
		if (isNaN(data)) return;
		this.value = data;
	}

	addLog(text: string) {
		this.value.push({
			text,
			date: new Date(),
		});
		this.getComponentManager()?.render();
	}

	clearLogs() {
		this.value = [];
		this.getComponentManager()?.render();
	}
}