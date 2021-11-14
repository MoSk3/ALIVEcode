import { createContext } from "react";
import {
	IoTProject,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../Models/Iot/IoTproject.entity';
import { IotRoute } from '../../Models/Iot/IoTroute.entity';
import { IoTObject } from '../../Models/Iot/IoTobject.entity';

export type IoTProjectContextValues = {
	project: IoTProject | null;
	canEdit: boolean;
	updateId: string;
	isLevel: boolean;
	addRoute: (route: IotRoute) => void;
	addIoTObject: (iotObject: IoTObject) => void;
	loadIoTObjects: () => void;
	updateProjectData: (
		name: string,
		desc: string,
		access: IOTPROJECT_ACCESS,
		interactRights: IOTPROJECT_INTERACT_RIGHTS,
	) => void;
};

export const IoTProjectContext = createContext<IoTProjectContextValues>({
	canEdit: false,
	project: null,
	updateId: '',
	isLevel: false,
	addRoute: () => {},
	addIoTObject: () => {},
	loadIoTObjects: () => {},
	updateProjectData: () => {},
});