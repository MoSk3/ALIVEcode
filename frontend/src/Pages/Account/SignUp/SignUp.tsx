import { SignUpProps, FormSignUpValues } from './signUpTypes';
import { Button, Form, Col } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { USER_TYPES } from '../../../Types/userTypes';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import Link from '../../../Components/UtilsComponents/Link/Link';
import axios, { AxiosError } from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { User } from '../../../Models/User/user.entity';
import { useHistory } from 'react-router';
import { setAccessToken } from '../../../Types/accessToken';
import { useTranslation } from 'react-i18next';

const SignUp = ({ userType }: SignUpProps) => {
	const { setUser } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const { t } = useTranslation();
	const alert = useAlert();
	const history = useHistory();

	const onSignIn = async (formValues: FormSignUpValues) => {
		try {
			const url =
				userType === USER_TYPES.PROFESSOR
					? 'users/professors'
					: 'users/students';

			// Register the user in the database
			await axios.post(url, formValues);

			// Generate and return new accessToken
			const { accessToken } = (
				await axios.post('users/login', {
					email: formValues.email,
					password: formValues.password,
				})
			).data;

			setAccessToken(accessToken);

			const user = await User.loadUser();
			if (!user)
				return alert.error('Une erreur est survenue, veuillez réessayer');

			setUser(user);

			if (history.location.pathname === '/signin') history.push('/dashboard');
			return alert.success('Vous êtes connecté avec votre nouveau compte!');
		} catch (err) {
			if (process.env.debug)
				return alert.error(
					'Erreur : ' +
						((err as AxiosError).response?.data.message ??
							'veuillez réessayer'),
				);
			return alert.error('Erreur inconnue, veuillez réessayer');
		}
	};

	return (
		<FormContainer title={t('form.title.signup')}>
			<Form onSubmit={handleSubmit(onSignIn)}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>{t('form.email.label')}</Form.Label>
					<Form.Control
						type="email"
						autoComplete="on"
						placeholder={t('form.email.placeholder')}
						{...register('email', { required: true })}
					/>
					{errors.email?.type === 'required' && t('form.email.required')}
					<Form.Text>{t('form.email.info')}</Form.Text>
				</Form.Group>
				{userType === USER_TYPES.PROFESSOR ? (
					<Form.Row>
						<Form.Group as={Col}>
							<Form.Label>{t('form.firstName.label')}</Form.Label>
							<Form.Control
								placeholder={t('form.firstName.placeholder')}
								autoComplete="on"
								{...register('firstName', {
									required: true,
									minLength: 3,
									maxLength: 25,
								})}
							/>
							{errors.firstName?.type === 'required' &&
								t('form.firstName.required')}
							{errors.firstName?.type === 'minLength' &&
								t('form.error.minLength', { min: 3 })}
							{errors.firstName?.type === 'maxLength' &&
								t('form.error.maxLength', { max: 25 })}
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Label>{t('form.lastName.label')}</Form.Label>
							<Form.Control
								placeholder="Soldevila"
								autoComplete="on"
								{...register('lastName', {
									required: true,
									minLength: 3,
									maxLength: 25,
								})}
							/>
							{errors.lastName?.type === 'required' &&
								t('form.lastName.required')}
							{errors.lastName?.type === 'minLength' &&
								t('form.error.minLength', { min: 3 })}
							{errors.lastName?.type === 'maxLength' &&
								t('form.error.maxLength', { max: 25 })}
						</Form.Group>
					</Form.Row>
				) : (
					<>
						<Form.Group>
							<Form.Label>{t('form.name.label')}</Form.Label>
							<Form.Control
								placeholder={t('form.name.placeholder')}
								{...register('name', {
									required: true,
									minLength: 3,
									maxLength: 20,
								})}
							/>
							{errors.name?.type === 'required' && t('form.name.required')}
							{errors.name?.type === 'minLength' &&
								t('form.error.minLength', { min: 3 })}
							{errors.name?.type === 'maxLength' &&
								t('form.error.maxLength', { max: 20 })}
						</Form.Group>
						<Form.Group>
							<Form.Label>{t('form.scholarity.label')}</Form.Label>
							<Form.Control
								placeholder={t('form.scholarity.placeholder')}
								autoComplete="on"
								{...register('scholarity', { required: true })}
							/>
							{errors.scholarity?.type === 'required' &&
								t('form.scholarity.required')}
						</Form.Group>
					</>
				)}
				<Form.Group>
					<Form.Label>{t('form.pwd.label')}</Form.Label>
					<Form.Control
						type="password"
						autoComplete="current-password"
						placeholder={t('form.pwd.placeholder')}
						{...register('password', {
							required: true,
							minLength: 6,
							maxLength: 32,
						})}
					/>
					{errors.password?.type === 'required' && t('form.pwd.required')}
					{errors.password?.type === 'minLength' &&
						t('form.error.minLength', { min: 6 })}
					{errors.password?.type === 'maxLength' &&
						t('form.error.maxLength', { max: 32 })}
				</Form.Group>
				<Button variant="primary" type="submit">
					{t('msg.auth.signin')}
				</Button>
				<br />
				<br />
				{t('msg.auth.already_registered')}{' '}
				<Link pale to="/signin">
					{t('msg.auth.signin')}
				</Link>
			</Form>
		</FormContainer>
	);
};

export default SignUp;