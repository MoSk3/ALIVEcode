import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useContext } from 'react';
import { useAlert } from 'react-alert';
import { FormSignInValues, SignInProps } from './signInTypes';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { UserContext } from '../../../UserContext';
import { User } from '../../../Types/User';

import './form.css';

/** Reusable form component to handle header creation */
const SignIn = (props: SignInProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const { setUser } = useContext(UserContext);
	const history = useHistory();
	const alert = useAlert();

	const onSignIn = async (formValues: FormSignInValues) => {
		try {
			const { access, refresh } = (await axios.post('/token/obtain/', formValues)).data;
			axios.defaults.headers['Authorization'] = "JWT " + access;
			localStorage.setItem('access_token', access);
			localStorage.setItem('refresh_token', refresh);

			const user: User = (await axios.get('/user/info/')).data;
			console.log(user)
			setUser(user);

			history.push('/dashboard');
			return alert.success("Vous êtes connecté!");

		} catch (err) {
			console.error(err);
			return alert.error("Une erreur est survenue");
		}
	};

	return (
		<Container fluid="sm">
			<Form onSubmit={handleSubmit(onSignIn)}>
				<Form.Group controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						{...register('email')}
					/>
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="*****"
						{...register('password')}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Se connecter
				</Button>
			</Form>
		</Container>
	);
}

export default SignIn;


/*

 <div id='main-div' class="container-fluid" style="position: relative; max-width: 100%;">
		<form action="" method="POST">
				{% csrf_token %}
				<h1>Connexion</h1>
				<br>
				{% if messages %}
				{% for message in messages %}
				{% if message.tags == 'success'%}
				<div class="alert alert-success">{{message}}</div>
				{% elif message.tags == 'error'%}
				<div class="alert alert-warning">{{message}}</div>
				{% endif %}
				{% endfor %}
				{% endif %}
				<div class="form-group">
						<label for="exampleInputEmail1">Adresse courriel</label><br>
						<input type="text" name="email" placeholder="Email" class="form-control" required>
				</div>
				<div class="form-group">
						<label for="exampleInputPassword1">Mot de passe</label><br>
						<input type="password" name="password" placeholder="*****" class="form-control" required>
				</div>
				<button type="submit" id="button-submit" class="btn btn-primary">Connexion</button>
				<br><br>
				<label>Vous n'avez pas de compte? <a
								href="{% url 'home:register' %}{% if request.GET.next is not None %}?next={{ request.GET.next }}{% endif %}">S'inscrire</a></label>
		</form>
</div>

*/