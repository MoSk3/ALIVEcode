import FormContainer from '../../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import Form from '../../../UtilsComponents/Form/Form';
import { useHistory } from 'react-router';
import useRoutes from '../../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import { IoTProject } from '../../../../Models/Iot/IoTproject.entity';
import {
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../../Models/Iot/IoTproject.entity';

/** Reusable form component to handle header creation */
const IoTProjectCreate = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { routes } = useRoutes();
	const alert = useAlert();

	return (
		<FormContainer title={t('form.title.create_iot_project')}>
			<Form
				onSubmit={res => {
					const project: IoTProject = res.data;
					history.push(routes.auth.iot_project.path.replace(':id', project.id));
					return alert.success('Projet créé avec succès');
				}}
				name="iot_project"
				url="iot/projects"
				action="POST"
				inputGroups={[
					{
						name: 'name',
						required: true,
						inputType: 'text',
						minLength: 3,
						maxLength: 25,
					},
					{
						name: 'description',
						inputType: 'text',
						maxLength: 200,
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						selectOptions: IOTPROJECT_ACCESS,
					},
					{
						name: 'interactRights',
						required: true,
						inputType: 'select',
						selectOptions: IOTPROJECT_INTERACT_RIGHTS,
					},
				]}
			/>
		</FormContainer>
	);
};

export default IoTProjectCreate;