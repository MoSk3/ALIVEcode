import './App.css';
import { RouterSwitch } from './Router/RouterSwitch/RouterSwitch';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import ALIVENavbar from './Components/MainComponents/Navbar/Navbar';
import { UserContext } from './state/contexts/UserContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BackArrow from './Components/UtilsComponents/BackArrow/BackArrow';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { User, Professor, Student, setAccessToken } from './Models/User';
import useRoutes from './state/hooks/useRoutes';
import { SERVER_URL } from './appConfigs';

const App = () => {
	const [user, setUser] = useState<Student | Professor | null>(null);
	const [loading, setLoading] = useState(true);

	const { routes } = useRoutes();
	const history = useHistory();
	const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	const logout = useCallback(async () => {
		await axios.get('logout');
		setAccessToken('');
		setUser(null);
	}, []);

	useEffect(() => {
		const getUser = async () => {
			try {
				const { accessToken } = (await axios.post('/users/refreshToken')).data;
				if (!accessToken) throw new Error('Could not login');
				setAccessToken(accessToken);

				const loadedUser = await User.loadUser();
				setLoading(false);
				if (!loadedUser) return history.push(routes.non_auth.signin.path);

				setUser(loadedUser);
			} catch {
				return setLoading(false);
			}
		};
		getUser();

		axios.interceptors.response.use(
			response => response,
			async error => {
				const originalRequest = error.config;
				if (
					error.response &&
					error.response.status === 401 &&
					originalRequest.url === SERVER_URL + 'users/refreshToken'
				) {
					if (user) logout();
					return Promise.reject(error);
				}
				console.log(error.response);
				if (
					error.response &&
					error.response.data.message === 'Forbidden resource' &&
					error.response.status === 403 &&
					error.response.statusText === 'Forbidden'
				) {
					try {
						const { accessToken } = (await axios.post('/users/refreshToken'))
							.data;
						if (!accessToken) return Promise.reject(error);
						setAccessToken(accessToken);
						originalRequest.headers.Authorization = 'JWT ' + accessToken;

						return axios(originalRequest);
					} catch (err) {
						console.error(err);
					}
				}
				return Promise.reject(error);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="App">
			{loading ? (
				<div>
					<h2>Loading...</h2>
				</div>
			) : (
				<Router>
					<UserContext.Provider value={providerValue}>
						<ALIVENavbar handleLogout={logout} />
						<section className="m-auto my-4">
							<RouterSwitch />
						</section>
						<BackArrow />
					</UserContext.Provider>
				</Router>
			)}
		</div>
	);
};

export default App;
