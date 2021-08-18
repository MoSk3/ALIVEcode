import { Exclude, Type } from 'class-transformer';
import { User } from '../User/user.entity';

export abstract class CreatedByUser {
	@Exclude({ toPlainOnly: true })
	id: string;

	name: string;

	abstract creator: User;

	@Exclude({ toPlainOnly: true })
	@Type(() => Date)
	creationDate: Date;

	@Exclude({ toPlainOnly: true })
	@Type(() => Date)
	updateDate: Date;

	description: string;
}