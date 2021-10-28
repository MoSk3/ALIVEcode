import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import IoTRouteCard from '../../IoTRoute/IoTRouteCard/IoTRouteCard';
import FormModal from '../../../UtilsComponents/FormModal/FormModal';
import { IoTProjectRoutesProps } from './IoTProjectRoutesTypes';
import { IotRoute } from '../../../../Models/Iot/IoTroute.entity';
import { useState } from 'react';
import { IoTporjectAddRouteForm } from '../IoTProjectAddRouteForm/IoTProjectAddRouteForm';

export const IoTProjectRoutes = ({
	project,
	setProject,
}: IoTProjectRoutesProps) => {
	const [routeModalOpen, setRouteModalOpen] = useState(false);

	return (
		<>
			<div className="project-details-content-header">
				<label className="mr-2">Routes</label>
				<IconButton icon={faPlus} onClick={() => setRouteModalOpen(true)} />
			</div>
			<div>
				{project.routes.length > 0 ? (
					project.routes.map((r, idx) => <IoTRouteCard key={idx} route={r} />)
				) : (
					<label className="disabled-text">No route</label>
				)}
			</div>
			<FormModal
				title="New route"
				onSubmit={res => {
					const resRoute: IotRoute = res.data;
					project.routes.push(resRoute);
					setProject(project);
					setRouteModalOpen(false);
				}}
				onClose={() => setRouteModalOpen(false)}
				open={routeModalOpen}
			>
				<IoTporjectAddRouteForm project={project} />
			</FormModal>
		</>
	);
};

export default IoTProjectRoutes;