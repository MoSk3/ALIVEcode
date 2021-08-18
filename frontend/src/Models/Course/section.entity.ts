import { Exclude } from "class-transformer";

export class Section {
	@Exclude({ toPlainOnly: true })
	id: number;

	name: string;
}