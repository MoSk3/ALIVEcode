import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form as BootForm, InputGroup } from 'react-bootstrap';
import Button from '../Button/Button';
import { FormProps, InputGroup as InputGroupModel } from './formTypes';
import axios, { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import { prettyField } from '../../../Types/formatting';

/**
 * Form used to create or alter a relation in the database that auto-generates the fields depending of the arguments.
 * The fields can contain enums, error handling and auto-traduction.
 *
 * example of a component creating a course:
 * 	<Form
 * 	  name='create_course',
 *    url='url_where_to_make_the_request',
 * 	  action='POST',
 * 	  onSubmit={(newPlainCourse) => {
 * 			// res is the data object of the response object
 * 			const newCourse: Course = plainToClass(Course, newPlainCourse);
 *    }},
 *		inputGroups={[
 *			{
 *				name: 'name',
 *				required: true,
 *				inputType: 'text',
 *				minLength: 3,
 *				maxLength: 25,
 *			},
 *			{
 *				name: 'description',
 *				inputType: 'text',
 *				maxLength: 200,
 *			},
 *			{
 *				name: 'subject',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_SUBJECT,
 *			},
 *			{
 *				name: 'access',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_ACCESS,
 *			},
 *			{
 *				name: 'difficulty',
 *				required: true,
 *				inputType: 'select',
 *				selectOptions: COURSE_DIFFICULTY,
 *			},
 *    ]}
 * />
 *
 * @author MoSk3
 */
const Form = (props: FormProps) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const alert = useAlert();
	const history = useHistory();

	const onFormSubmit = async (formValues: any) => {
		if (process.env.DEBUG) console.log(formValues);
		try {
			let res;
			switch (props.action) {
				case 'POST':
					res = await axios.post(props.url, formValues);
					break;
				case 'PATCH':
					res = await axios.patch(props.url, formValues);
					break;
				case 'DELETE':
					res = await axios.delete(props.url, formValues);
					break;
			}
			if (res && props.onSubmit) props.onSubmit(res);
		} catch (err) {
			const axiosError = err as AxiosError;
			switch (axiosError.response?.status) {
				case 500:
					return alert.error(t('error.500'));
				case 403:
					return history.push('/');
			}
		}
	};

	const renderFormInput = (g: InputGroupModel) => {
		const placeholderValue = t([
			`form.${props.name}.${props.action}.${g.name}.placeholder`,
			`form.${props.name}.${g.name}.placeholder`,
			prettyField(g.name),
		]);
		const registerOptions = {
			required: g.required,
			minLength: g.minLength,
			maxLength: g.maxLength,
		};
		switch (g.inputType) {
			case 'select':
				return (
					<BootForm.Control
						style={{ paddingRight: 0 }}
						isInvalid={errors[g.name]?.type}
						as="select"
						placeholder={placeholderValue}
						defaultValue={g.default}
						{...register(g.name, registerOptions)}
					>
						{Array.isArray(g.selectOptions)
							? g.selectOptions?.map((opt: any, idx) => (
									<option key={g.name + idx} value={opt}>
										{opt}
									</option>
							  ))
							: Object.keys(g.selectOptions as { [key: string]: any })
									.filter(k => isNaN(Number(k)))
									.map((k, idx) => (
										<option
											key={g.name + idx}
											value={(g.selectOptions as { [key: string]: any })[k]}
										>
											{k.toLowerCase()}
										</option>
									))}
					</BootForm.Control>
				);
			default:
				return (
					<BootForm.Control
						style={{ paddingRight: 0 }}
						isInvalid={errors[g.name]?.type}
						type={g.inputType}
						defaultValue={g.default}
						placeholder={placeholderValue}
						{...register(g.name, registerOptions)}
					/>
				);
		}
	};

	return (
		<BootForm onSubmit={handleSubmit(onFormSubmit)}>
			{props.inputGroups.map((g, idx) => (
				<BootForm.Group key={idx}>
					<BootForm.Label>
						{t([
							`form.${props.name}.${props.action}.${g.name}.label`,
							`form.${props.name}.${g.name}.label`,
							prettyField(g.name),
						])}
					</BootForm.Label>
					<InputGroup
						hasValidation={
							g.maxLength != null || g.minLength != null || g.required
						}
					>
						{renderFormInput(g)}
						{(g.maxLength != null || g.minLength != null || g.required) && (
							<BootForm.Control.Feedback
								style={{ wordWrap: 'break-word' }}
								type="invalid"
							>
								{errors[g.name]?.type === 'required' &&
									t([
										`form.${props.name}.${props.action}.${g.name}.error.required`,
										`form.${props.name}.${g.name}.error.required`,
										'form.error.required',
									])}
								{errors[g.name]?.type === 'maxLength' &&
									t(
										[
											`form.${props.name}.${props.action}.${g.name}.error.maxLength`,
											`form.${props.name}.${g.name}.error.maxLength`,
											'form.error.maxLength',
										],
										{ max: g.maxLength },
									)}
								{errors[g.name]?.type === 'minLength' &&
									t(
										[
											`form.${props.name}.${props.action}.${g.name}.error.minlength`,
											`form.${props.name}.${g.name}.error.minLength`,
											'form.error.minLength',
										],
										{ min: g.minLength },
									)}
							</BootForm.Control.Feedback>
						)}
					</InputGroup>
				</BootForm.Group>
			))}
			<Button
				variant={props.action === 'DELETE' ? 'danger' : 'primary'}
				type="submit"
			>
				{t(
					[
						`form.${props.name}.${props.action}.submit`,
						`form.${props.name}.submit`,
						`form.submit.${props.action}`,
					],
					{ name: prettyField(props.name) },
				)}
			</Button>
		</BootForm>
	);
};

export default Form;
