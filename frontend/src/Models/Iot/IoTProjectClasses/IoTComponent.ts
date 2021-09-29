
export enum IOT_COMPONENT_TYPE {
	BUTTON,
	PROGRESS_BAR,
}

export abstract class IoTComponent {
	public id: string;
	public value: any;
	public type: IOT_COMPONENT_TYPE;

	abstract update(data: any): void;
}