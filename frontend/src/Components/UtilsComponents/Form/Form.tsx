import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Form as BootForm } from 'react-bootstrap';
import Button from '../Button/Button';
import { FormProps } from './formTypes';
import axios from 'axios';

const Form = (props: FormProps) => {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onFormSubmit = async (formValues: any) => {
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
	};

	return (
		<BootForm onSubmit={handleSubmit(onFormSubmit)}>
			{props.inputGroups.map(g => (
				<BootForm.Group>
					<BootForm.Label>
						{t(`form.${props.name}.${g.name}.label`)}
					</BootForm.Label>
					<BootForm.Control
						type={g.inputType}
						placeholder={t(`form.${props.name}.${g.name}.placeholder`)}
						{...register(g.name, {
							required: g.required,
							minLength: g.minLength ?? undefined,
							maxLength: g.maxLength ?? undefined,
						})}
					/>
					{errors[g.name]?.type === 'required' &&
						t(`form.${props.name}.${g.name}.error.required`)}
					{errors[g.name]?.type === 'maxLength' &&
						t(`form.${props.name}.${g.name}.error.maxLength`)}
					{errors[g.name]?.type === 'minLength' &&
						t(`form.${props.name}.${g.name}.error.minLength`)}
				</BootForm.Group>
			))}
			<Button variant="primary" type="submit">
				{t('msg.auth.signin')}
			</Button>
		</BootForm>
	);
};

export default Form;
