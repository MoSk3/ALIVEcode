import { ClassroomFormProps } from './classroomFormTypes';
import Form from '../../UtilsComponents/Form/Form';
import FormContainer from '../../UtilsComponents/FormContainer/FormContainer';

const ClassroomForm = (props: ClassroomFormProps) => {
	return (
		<FormContainer title="LOL">
			<Form
				name="LOL"
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
					{
						name: 'bob',
						inputType: 'number',
						required: true,
					},
				]}
			/>
		</FormContainer>
	);
};

export default ClassroomForm;