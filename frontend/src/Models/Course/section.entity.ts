import { Exclude, Type } from "class-transformer";
import { Activity } from './activity.entity';

export class Section {
	@Exclude({ toPlainOnly: true })
	id: number;
	name: string;

	@Type(() => Activity)
	activities: Activity[];
}