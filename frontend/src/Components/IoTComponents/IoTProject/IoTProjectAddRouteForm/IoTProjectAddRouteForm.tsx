import { IoTProject } from "../../../../Models/Iot/IoTproject.entity";
import Form from '../../../UtilsComponents/Form/Form';

export const IoTporjectAddRouteForm = ({
	project,
}: {
	project: IoTProject;
}) => {
	return (
		<Form
			action="POST"
			name="create_iot_route"
			url={`iot/projects/${project.id}/routes`}
			inputGroups={[
				{
					name: 'name',
					required: true,
					inputType: 'text',
				},
				{
					name: 'path',
					required: true,
					inputType: 'text',
				},
			]}
		/>
	);
};