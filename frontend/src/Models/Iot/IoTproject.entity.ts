import { CreatedByUser } from "../Generics/createdByUser.entity";
import { User } from '../User/user.entity';
import { IotRoute } from './IoTroute.entity';
import api from '../api';
import { IOT_COMPONENT_TYPE } from './IoTProjectClasses/IoTComponent';
import { Transform, plainToClass } from 'class-transformer';
import { IoTButton } from './IoTProjectClasses/Components/IoTButton';
import { IoTComponent } from './IoTProjectClasses/IoTComponent';
import { IoTProgressBar } from './IoTProjectClasses/Components/IoTProgressBar';
import { IoTLogs } from './IoTProjectClasses/Components/IoTLogs';

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

export type IoTProjectLayout = Array<IoTComponent>;
export class IoTProject extends CreatedByUser {
	creator: User;

	@Transform(({ value }) => {
		return value.map((comp: IoTComponent) => {
			if (comp.type === IOT_COMPONENT_TYPE.BUTTON)
				return plainToClass(IoTButton, comp);
			if (comp.type === IOT_COMPONENT_TYPE.PROGRESS_BAR)
				return plainToClass(IoTProgressBar, comp);
			if (comp.type === IOT_COMPONENT_TYPE.LOGS)
				return plainToClass(IoTLogs, comp);

			return comp;
		});
	})
	layout: IoTProjectLayout;

	access: IOTPROJECT_ACCESS;

	interactRights: IOTPROJECT_INTERACT_RIGHTS;

	collaborators: User[];

	routes: IotRoute[];

	async getRoutes() {
		return await api.db.iot.projects.getRoutes({ id: this.id });
	}
}
