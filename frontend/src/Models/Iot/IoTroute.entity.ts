import { Exclude } from 'class-transformer';
import { IoTProject } from './IoTproject.entity';

export class IotRoute {
	@Exclude({ toPlainOnly: true })
	id: string;

	name: string;

	path: string;

	project: IoTProject;
}
