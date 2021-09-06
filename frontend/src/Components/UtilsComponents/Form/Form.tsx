import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form as BootForm } from 'react-bootstrap';
import Button from '../Button/Button';
import { FormProps, InputGroup } from './formTypes';
import axios, { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';
import { prettyField } from '../../../Types/formatting';

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
				case 'UPDATE':
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

	const renderFormInput = (g: InputGroup) => {
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
					{renderFormInput(g)}
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
