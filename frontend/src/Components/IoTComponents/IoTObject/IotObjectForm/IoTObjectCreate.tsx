import Form from "../../../UtilsComponents/Form/Form"
import { useTranslation } from 'react-i18next';
import { IOTOBJECT_LABEL } from '../../../../Models/Iot/IoTobject.entity';
import { useAlert } from 'react-alert';
import { IoTObjectCreateProps } from './iotObjectCreateProps';

const IoTObjectCreate = ({ onSubmit }: IoTObjectCreateProps) => {
	const { t } = useTranslation();
	const alert = useAlert();

	return (
		<Form
			onSubmit={res => {
				onSubmit && onSubmit(res);
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
	);
};

export default IoTObjectCreate;