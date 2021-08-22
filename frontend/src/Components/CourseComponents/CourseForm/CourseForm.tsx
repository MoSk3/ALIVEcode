import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import { useTranslation } from 'react-i18next';
import { CourseFormProps } from './courseFormTypes';
import Form from '../../UtilsComponents/Form/Form';
import { useHistory } from 'react-router';
import useRoutes from '../../../state/hooks/useRoutes';
import { useAlert } from 'react-alert';
import {
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
	COURSE_ACCESS,
	Course,
} from '../../../Models/Course/course.entity';

/** Reusable form component to handle header creation */
const CourseForm = (props: CourseFormProps) => {
	const { t } = useTranslation();
	const history = useHistory();
	const { routes } = useRoutes();
	const alert = useAlert();

	return (
		<FormContainer title={t('form.title.create_course')}>
			<Form
				onSubmit={res => {
					const course: Course = res.data;
					history.push(routes.auth.course.path.replace(':id', course.id));
					return alert.success('Cours créé avec succès');
				}}
				buttonText={t('form.submit.create_course')}
				name="create_course"
				url="courses"
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
						name: 'subject',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_SUBJECT,
					},
					{
						name: 'access',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_ACCESS,
					},
					{
						name: 'difficulty',
						required: true,
						inputType: 'select',
						selectOptions: COURSE_DIFFICULTY,
					},
				]}
			/>
		</FormContainer>
	);
};

export default CourseForm;