import { Exclude } from 'class-transformer';

export class Maintenance {
	@Exclude()
	id: string;

	name: string;
	description?: string;

	startDate: Date;
	finishDate: Date;
	started: boolean;
	finished: boolean;

	hidden: boolean = false;
}
