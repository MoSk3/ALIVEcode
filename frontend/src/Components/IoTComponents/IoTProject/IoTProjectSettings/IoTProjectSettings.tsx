import Form from '../../../UtilsComponents/Form/Form';
import { useContext } from 'react';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import {
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../../Models/Iot/IoTproject.entity';

export const IoTProjectSettings = () => {
	const { project, canEdit, updateProjectData } = useContext(IoTProjectContext);

	if (!project) return <></>;

	return (
		<>
			<div className="project-details-content-header">Settings</div>
			<Form
				onSubmit={res => {
					const { name, desc, access, interactRights } = res.data;
					updateProjectData(name, desc, access, interactRights);
				}}
				disabled={!canEdit}
				action="PATCH"
				name="iot_project"
				url={`iot/projects/${project.id}`}
				inputGroups={[
					{
						name: 'name',
						required: true,
						default: project.name,
						inputType: 'text',
					},
					{
						name: 'description',
						required: false,
						default: project.description,
						inputType: 'text',
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						default: project.access,
						selectOptions: IOTPROJECT_ACCESS,
					},
					{
						name: 'interactRights',
						required: true,
						default: project.interactRights,
						inputType: 'select',
						selectOptions: IOTPROJECT_INTERACT_RIGHTS,
					},
				]}
			/>
		</>
	);
};

export default IoTProjectSettings;