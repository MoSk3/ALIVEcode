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
import useRoutes from './state/hooks/useRoutes';
import { ThemeContext, Theme, themes } from './state/contexts/ThemeContext';
import styled, { createGlobalStyle } from 'styled-components';
import { loadThemeFromCookies, setCookie } from './Types/cookies';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { setAccessToken } from './Types/accessToken';
import { User, Student, Professor } from './Models/User/user.entity';
import LoadingScreen from './Components/UtilsComponents/LoadingScreen/LoadingScreen';
import background_image_light from './assets/images/backgroundImage4.png';

type GlobalStyleProps = {
	theme: Theme;
};

const GlobalStyle = createGlobalStyle`

	body {
		background-color: var(--background-color);
		color: var(--foreground-color);
		${({ theme }: GlobalStyleProps) => {
			return theme.name === 'light'
				? `background-image: url(${background_image_light});`
				: '';
		}}
	}

	${({ theme }: GlobalStyleProps) => {
		return `:root {
						--primary-color: ${theme.color.primary};
						--primary-color-rgb: ${theme.color.primary_rgb};
						--secondary-color: ${theme.color.secondary};
						--secondary-color-rgb: ${theme.color.secondary_rgb};
						--third-color: ${theme.color.third};
						--third-color-rgb: ${theme.color.third_rgb};
						--fourth-color: ${theme.color.fourth};
						--fourth-color-rgb: ${theme.color.fourth_rgb};
						--pale-color: ${theme.color.pale};
						--pale-color-rgb: ${theme.color.pale_rgb};
						--contrast-color: ${theme.color.contrast};
						--contrast-color-rgb: ${theme.color.contrast};
						--hover-color: ${theme.color.hover};
						--background-color: ${theme.color.background};
						--background-color-rgb: ${theme.color.background_rgb};
						--foreground-color: ${theme.color.foreground};
						--foreground-color-rgb: ${theme.color.foreground_rgb};
					}
				`;
	}}
`;

const StyledApp = styled.section``;

const App = () => {
	const [user, setUser] = useState<Student | Professor | null>(null);
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState(themes.light);

	const { routes } = useRoutes();
	const { t } = useTranslation();
	const alert = useAlert();

	const history = useHistory();
	const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

	const handleSetTheme = (theme: Theme) => {
		setCookie('theme', theme.name, 365);
		setTheme(theme);
	};

	const logout = useCallback(async () => {
		try {
			await axios.get('users/logout');
			setAccessToken('');
			setUser(null);
		} catch {
			alert.error(t('error.logout'));
		}
	}, [alert, t]);

	useEffect(() => {
		// Persist login
		const getUser = async () => {
			try {
				const { accessToken } = (await axios.post('/users/refreshToken')).data;
				if (!accessToken) throw new Error('Could not login');
				setAccessToken(accessToken);

				const loadedUser = await User.loadUser();
				setLoading(false);
				if (!loadedUser) {
					const loadedTheme = loadThemeFromCookies();
					if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
					return history.push(routes.non_auth.signin.path);
				}
				const loadedTheme = loadThemeFromCookies();
				if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
				setUser(loadedUser);
			} catch {
				const loadedTheme = loadThemeFromCookies();
				if (loadedTheme && loadedTheme !== theme) setTheme(loadedTheme);
				return setLoading(false);
			}
		};
		getUser();

		// Automatically refresh access token
		axios.interceptors.response.use(
			response => response,
			async error => {
				const originalRequest = error.config;
				if (
					error.response &&
					error.response.status === 401 &&
					originalRequest.url ===
						process.env.REACT_APP_BACKEND_URL + 'users/refreshToken'
				) {
					if (user) await logout();
					return Promise.reject(error);
				}
				// TODO : remove in production
				if (process.env.DEBUG && error.response) console.log(error.response);
				if (
					error.response &&
					error.response.data.message === 'Not Authenticated' &&
					error.response.status === 401 &&
					error.response.statusText === 'Unauthorized'
				) {
					try {
						const { accessToken } = (await axios.post('/users/refreshToken'))
							.data;
						if (!accessToken) return Promise.reject(error);
						setAccessToken(accessToken);
						originalRequest.headers.Authorization = 'JWT ' + accessToken;

						return axios(originalRequest);
					} catch (err) {
						if (process.env.DEBUG) console.error(err);
					}
				}
				return Promise.reject(error);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="App">
			<ThemeContext.Provider
				value={{
					theme,
					setTheme: handleSetTheme,
				}}
			>
				<GlobalStyle theme={theme} />
				{loading ? (
					<LoadingScreen />
				) : (
					<Router>
						<UserContext.Provider value={providerValue}>
							<ALIVENavbar handleLogout={async () => await logout()} />
							<StyledApp theme={theme} className="m-auto my-4">
								<RouterSwitch />
							</StyledApp>
							<BackArrow />
						</UserContext.Provider>
					</Router>
				)}
			</ThemeContext.Provider>
		</div>
	);
};

export default App;
