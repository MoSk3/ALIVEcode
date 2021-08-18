import { SignUpProps, FormSignUpValues } from './signUpTypes';
import { Button, Form, Col } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { useForm } from 'react-hook-form';
import { USER_TYPES } from '../../../Types/userTypes';
import FormContainer from '../../../Components/UtilsComponents/FormContainer/FormContainer';
import Link from '../../../Components/UtilsComponents/Link/Link';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../../state/contexts/UserContext';
import { User } from '../../../Models/User/user.entity';
import { useHistory } from 'react-router';
import { setAccessToken } from '../../../Types/accessToken';

const SignUp = ({ userType }: SignUpProps) => {
	const { setUser } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
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
			console.error(err);
			return alert.error('Une erreur est survenue');
		}
	};

	return (
		<FormContainer title="Inscription">
			<Form onSubmit={handleSubmit(onSignIn)}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Adresse courriel</Form.Label>
					<Form.Control
						type="email"
						autoComplete="on"
						placeholder="Adresse courriel"
						{...register('email')}
					/>
					{errors.email?.type === 'required' &&
						'Une adresse courriel est requise'}
					<Form.Text>
						Nous n'allons jamais partager votre adresse courriel.
					</Form.Text>
				</Form.Group>
				{userType === USER_TYPES.PROFESSOR ? (
					<Form.Row>
						<Form.Group as={Col}>
							<Form.Label>Nom</Form.Label>
							<Form.Control
								placeholder="Enric"
								autoComplete="on"
								{...register('firstName', { required: true })}
							/>
							{errors.professor?.first_name?.type === 'required' &&
								'Un nom est requis'}
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Label>Nom de famille</Form.Label>
							<Form.Control
								placeholder="Soldevila"
								autoComplete="on"
								{...register('lastName', { required: true })}
							/>
							{errors.professor?.last_name?.type === 'required' &&
								'Un nom de famille est requis'}
						</Form.Group>
					</Form.Row>
				) : (
					<>
						<Form.Group>
							<Form.Label>Pseudonyme</Form.Label>
							<Form.Control
								placeholder="pseudo"
								{...register('name', { required: true })}
							/>
							{errors.student?.name?.type === 'required' &&
								'Un pseudonyme est requis'}
						</Form.Group>
						<Form.Group>
							<Form.Label>Scholarité</Form.Label>
							<Form.Control
								placeholder="*****"
								autoComplete="on"
								{...register('scholarity', { required: true })}
							/>
							{errors.student?.scholarity?.type === 'required' &&
								'Le niveau scholaire est requis'}
						</Form.Group>
					</>
				)}
				<Form.Group>
					<Form.Label>Mot de passe</Form.Label>
					<Form.Control
						type="password"
						autoComplete="current-password"
						placeholder="*****"
						{...register('password', { required: true })}
					/>
					{errors.password?.type === 'required' && 'Un mot de passe est requis'}
				</Form.Group>
				<Button variant="primary" type="submit">
					Inscription
				</Button>
				<br />
				<br />
				Vous avez déjà un compte?{' '}
				<Link pale to="/signin">
					Se connecter
				</Link>
			</Form>
		</FormContainer>
	);
};

export default SignUp;