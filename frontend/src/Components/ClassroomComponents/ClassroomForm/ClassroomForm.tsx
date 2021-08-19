import { ClassroomFormProps } from './classroomFormTypes';
import Form from '../../UtilsComponents/Form/Form';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';

const ClassroomForm = (props: ClassroomFormProps) => {
	const { t } = useTranslation();

	return (
		<FormContainer title="LOL">
			<Form
				buttonText={t('form.submit.create_classrooms')}
				name="create_classroom"
				url="classrooms"
				action="POST"
				inputGroups={[
					{
						name: 'name',
						inputType: 'text',
						required: true,
					},
					{
						name: 'description',
						inputType: 'textarea',
						required: false,
					},
				]}
			/>
		</FormContainer>
	);
};

export default ClassroomForm;