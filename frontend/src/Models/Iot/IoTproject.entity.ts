import { CreatedByUser } from "../Generics/createdByUser.entity";
import { User } from '../User/user.entity';
import { IotRoute } from './IoTroute.entity';
import api from '../api';
import { IOT_COMPONENT_TYPE } from './IoTProjectClasses/IoTComponent';
import {
	Transform,
	plainToClass,
	TransformationType,
	Type,
} from 'class-transformer';
import { IoTButton } from './IoTProjectClasses/Components/IoTButton';
import { IoTComponent } from './IoTProjectClasses/IoTComponent';
import { IoTProgressBar } from './IoTProjectClasses/Components/IoTProgressBar';
import { IoTLogs } from './IoTProjectClasses/Components/IoTLogs';
import { IoTObject } from './IoTobject.entity';

export enum IOTPROJECT_INTERACT_RIGHTS {
	ANYONE = 'AN',
	COLLABORATORS = 'CO',
	PRIVATE = 'PR',
}

export enum IOTPROJECT_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	UNLISTED = 'UN', // must be shared via a url
	RESTRICTED = 'RE', // limited to certain classes
	PRIVATE = 'PR', // only accessible to the creator
}

export class IoTProjectLayout {
	components: Array<IoTComponent>;
}
export class IoTProject extends CreatedByUser {
	creator: User;

	@Transform(({ value, type }) => {
		if (
			type !== TransformationType.PLAIN_TO_CLASS ||
			!value ||
			!value.components
		) {
			return value;
		}

		value.components = value.components.map((comp: IoTComponent) => {
			if (comp.type === IOT_COMPONENT_TYPE.BUTTON)
				return plainToClass(IoTButton, comp);
			if (comp.type === IOT_COMPONENT_TYPE.PROGRESS_BAR)
				return plainToClass(IoTProgressBar, comp);
			if (comp.type === IOT_COMPONENT_TYPE.LOGS)
				return plainToClass(IoTLogs, comp);

			return undefined;
		});

		value.components = value.components.filter(
			(c: IoTComponent | undefined) => c != null,
		);
		return value;
	})
	layout: IoTProjectLayout;

	@Type(() => IoTObject)
	iotObjects?: IoTObject[];

	access: IOTPROJECT_ACCESS;

	interactRights: IOTPROJECT_INTERACT_RIGHTS;

	collaborators: User[];

	routes: IotRoute[];

	async getRoutes() {
		return await api.db.iot.projects.getRoutes({ id: this.id });
	}

	async getIoTObjects() {
		this.iotObjects = await api.db.iot.projects.getObjects({ id: this.id });
		return this.iotObjects;
	}
}
