import { Exclude, Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export class Level extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => User)
	creator: User;
}
