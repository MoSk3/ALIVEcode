import Form from '../../../UtilsComponents/Form/Form';
import { IoTProjectSettingsProps } from './IoTProjectSettingsTypes';
import { plainToClass } from 'class-transformer';
import {
	IoTProject as ProjectModel,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../../Models/Iot/IoTproject.entity';

export const IoTProjectSettings = ({
	project,
	setProject,
}: IoTProjectSettingsProps) => {
	return (
		<>
			<div className="project-details-content-header">Settings</div>
			<Form
				onSubmit={res => {
					const updatedProject: ProjectModel = plainToClass(
						ProjectModel,
						res.data,
					);
					updatedProject.routes = project.routes;
					updatedProject.layout = project.layout;
					setProject(updatedProject);
				}}
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