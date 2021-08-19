import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form as BootForm } from 'react-bootstrap';
import Button from '../Button/Button';
import { FormProps, InputGroup } from './formTypes';
import axios, { AxiosError } from 'axios';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router';

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
		console.log(formValues);
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
		const placeholderValue = t(`form.${props.name}.${g.name}.placeholder`);
		const registerOptions = {
			required: g.required,
			minLength: g.minLength ?? undefined,
			maxLength: g.maxLength ?? undefined,
		};
		switch (g.inputType) {
			case 'select':
				return (
					<BootForm.Control
						as="select"
						placeholder={placeholderValue}
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
						{t(`form.${props.name}.${g.name}.label`)}
					</BootForm.Label>
					{renderFormInput(g)}
					{errors[g.name]?.type === 'required' &&
						t(`form.${props.name}.${g.name}.error.required`)}
					{errors[g.name]?.type === 'maxLength' &&
						t(`form.${props.name}.${g.name}.error.maxLength`)}
					{errors[g.name]?.type === 'minLength' &&
						t(`form.${props.name}.${g.name}.error.minLength`)}
				</BootForm.Group>
			))}
			<Button
				variant={props.action === 'DELETE' ? 'danger' : 'primary'}
				type="submit"
			>
				{props.buttonText}
			</Button>
		</BootForm>
	);
};

export default Form;
