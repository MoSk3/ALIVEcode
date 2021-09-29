import { IoTProjectLayout } from '../IoTproject.entity';
import { IoTTarget } from './IoTTypes';
import { IoTComponent } from './IoTComponent';

export class IoTComponentManager {
	private components: Array<IoTComponent>;
	private onLayoutUpdate: (layout: Array<IoTComponent>) => void;
	private onRender: (layout: Array<IoTComponent>) => void;

	constructor(
		layout: IoTProjectLayout,
		onLayoutUpdate: (layout: Array<IoTComponent>) => void,
		onRender: (layout: Array<IoTComponent>) => void,
	) {
		this.components = layout.components;
		this.onLayoutUpdate = onLayoutUpdate;
		this.onRender = onRender;

		this.components = this.components.map(c => {
			c.setComponentManager(this);
			return c;
		});

		this.render();
	}

	public onReceive() {}

	public updateComponent(id: string, data: any) {
		const component = this.getComponent(id);
		if (!component) throw new Error(`No component with id ${id}`);
		component.update(data);
		this.render();
	}

	public getComponent(id: string): IoTComponent | undefined {
		return this.components.find(c => c.id === id);
	}

	public getComponents(): Array<IoTComponent> {
		return this.components;
	}

	private addComponent() {}

	public save() {}

	public send(target: IoTTarget) {}

	public render() {
		this.onRender(this.components);
	}
}