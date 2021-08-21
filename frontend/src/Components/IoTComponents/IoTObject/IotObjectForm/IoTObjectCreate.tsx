import Form from "../../../UtilsComponents/Form/Form"
import FormContainer from '../../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import {
	IoTObject,
	IOTOBJECT_LABEL,
} from '../../../../Models/Iot/IoTobject.entity';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import useRoutes from '../../../../state/hooks/useRoutes';

const IoTObjectCreate = () => {
	const { t } = useTranslation();
	const alert = useAlert();

	return (
		<FormContainer title={t('')}>
			<Form
				onSubmit={res => {
					const object: IoTObject = res.data;
					console.log(object);
					return alert.success('Objet connecté créé avec succès');
				}}
				buttonText={t('form.submit.create_iot_project')}
				name="create_iot_object"
				url="iot/objects"
				action="POST"
				inputGroups={[
					{
						name: 'name',
						required: true,
						inputType: 'text',
					},
					{
						name: 'description',
						required: false,
						inputType: 'text',
					},
					{
						name: 'label',
						required: true,
						inputType: 'select',
						selectOptions: IOTOBJECT_LABEL,
					},
				]}
			/>
		</FormContainer>
	);
};

export default IoTObjectCreate;