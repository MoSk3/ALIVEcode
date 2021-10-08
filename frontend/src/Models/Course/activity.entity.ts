import { Exclude, Type } from 'class-transformer';

export class ActivityContent {
	data: string;
}

export class Activity {
	@Exclude({ toClassOnly: true })
	id: number;

	name: string;

	@Type(() => ActivityContent)
	content: ActivityContent;
}