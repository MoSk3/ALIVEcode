import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import { Form } from 'react-bootstrap';
import Button from '../../../Components/UtilsComponents/Button/Button';
import Link from '../../../Components/UtilsComponents/Link/Link';
import { useTranslation } from 'react-i18next';
import { CourseFormProps, CourseFormValues } from './courseFormTypes';

/** Reusable form component to handle header creation */
const CourseForm = (props: CourseFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { t } = useTranslation();
	const alert = useAlert();

	const onCreateCourse = async (formValues: CourseFormValues) => {
		try {
			console.log((await axios.post('users/login/', formValues)).data);
		} catch (err) {
			return alert.error(
				'Erreur : ' +
					((err as AxiosError).response?.data.message ?? 'veuillez réessayer'),
			);
		}
	};

	return (
		<FormContainer title={t('form.title.create_course')}>
			<Form onSubmit={handleSubmit(onCreateCourse)}>
				<Form.Group>
					<Form.Label>{t('form.course.name.label')}</Form.Label>
					<Form.Control
						placeholder={t('form.course.name.placeholder')}
						{...register('name', { required: true })}
					/>
					{errors.email?.type === 'required' && t('form.name.error.required')}
				</Form.Group>
				<Form.Group>
					<Form.Label>{t('form.course.description.label')}</Form.Label>
					<Form.Control
						placeholder={t('form.course.description.placeholder')}
						{...register('name', { required: true })}
					/>
					{errors.email?.type === 'required' &&
						t('form.description.error.required')}
				</Form.Group>
				<Form.Group>
					<Form.Label>{t('form.course.description.label')}</Form.Label>
					<Form.Control
						placeholder={t('form.course.description.placeholder')}
						{...register('name', { required: true })}
					/>
					{errors.email?.type === 'required' &&
						t('form.description.error.required')}
				</Form.Group>

				<Button variant="primary" type="submit">
					{t('msg.auth.signin')}
				</Button>

				<br />
				<br />

				{t('home.navbar.msg.non_auth.label')}
				<Link pale to="/signup">
					{t('home.navbar.msg.non_auth.link')}
				</Link>
			</Form>
		</FormContainer>
	);
};

export default CourseForm;