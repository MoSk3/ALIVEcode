import { Exclude, Type } from 'class-transformer';

export class Maintenance {
	@Exclude()
	id: string;

	name: string;
	description?: string;

	@Type(() => Date)
	startDate: Date;

	@Type(() => Date)
	finishDate: Date;

	started: boolean;
	finished: boolean;

	hidden: boolean = false;
}
