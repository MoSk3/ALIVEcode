import './App.css';
import { RouterSwitch } from './Router/RouterSwitch/RouterSwitch';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import ALIVENavbar from './Components/MainComponents/Navbar/Navbar';
import { UserContext } from './UserContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BackArrow from './Components/MainComponents/BackArrow/BackArrow';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { User, Professor, Student } from './Models/User';
import useRoutes from './state/hooks/useRoutes';

const App = () => {
	const [user, setUser] = useState<Student | Professor | null>(null);

	const { routes } = useRoutes();
	const history = useHistory();
	const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	useEffect(() => {
		const getUser = async () => {
			const loadedUser = await User.loadUser();
			if (!loadedUser) return history.push(routes.non_auth.signin.path);

			setUser(loadedUser);
		};
		getUser();
	}, []);

	const handleLogout = useCallback(() => {
		axios.get('logout');
		localStorage.removeItem('access_token');
		axios.defaults.headers['Authorization'] = null;
		setUser(null);
	}, []);

	return (
		<div className="App">
			<Router>
				<UserContext.Provider value={providerValue}>
					<ALIVENavbar handleLogout={handleLogout} />
					<section className="m-auto my-4">
						<RouterSwitch />
					</section>
					<BackArrow />
				</UserContext.Provider>
			</Router>
		</div>
	);
};

export default App;
