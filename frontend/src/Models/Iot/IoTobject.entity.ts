import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export enum IoTObjectLabel {
	HOME,
	OTHER,
}

export class IoTObject extends CreatedByUser {
	creator: User;

	label: IoTObjectLabel;
}
