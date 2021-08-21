import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export enum IOTOBJECT_LABEL {
	HOME,
	OTHER,
}

export class IoTObject extends CreatedByUser {
	creator: User;

	label: IOTOBJECT_LABEL;
}
