import { Professor, Student } from '../../Models/User';
import { RouteComponentProps } from 'react-router-dom';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import Home from '../../Pages/Home/Home';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import SignUp from '../../Pages/Account/SignUp/SignUp';
import { USER_TYPES } from '../../Types/userTypes';
import Level from '../../Pages/Level/SimulationLevel';
import SignUpMenu from '../../Pages/Account/SignUpMenu/SignUpMenu';
import About from '../../Pages/About/About';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import Classroom from '../../Pages/Classroom/Classroom';

type component =
	| React.ComponentType<RouteComponentProps<any>>
	| React.ComponentType<any>;

export interface Route {
	path: string;
	exact?: boolean;
	component?: component;
	hasAccess?: boolean;
}

export interface AuthRoute extends Route {
	redirect?: component;
	accountType?: typeof Professor | typeof Student;
}

export interface RoutesGroup<T extends Route> {
	[key: string]: T;
}

const useRoutes = () => {
	const { user } = useContext(UserContext);

	const asRoutes = <T extends RoutesGroup<Route>>(routeGroup: T): T => {
		Object.values(routeGroup).forEach(route => {
			route.hasAccess = route.hasAccess ?? true;
		});
		return routeGroup;
	};

	const asAuthRoutes = <T extends RoutesGroup<AuthRoute>>(
		defaultRedirect: component,
		routeGroup: T,
	): T => {
		Object.values(routeGroup).forEach(route => {
			const redirect = route.redirect || defaultRedirect;
			if (
				!user ||
				(route.accountType === Professor && !user.professor) ||
				(route.accountType === Student && !user.student)
			) {
				route.component = redirect;
				route.hasAccess = false;
			}
		});
		return asRoutes(routeGroup);
	};

	const asNonAuthRoutes = <T extends RoutesGroup<AuthRoute>>(
		defaultRedirect: component,
		routeGroup: T,
	): T => {
		if (user) {
			Object.values(routeGroup).forEach(route => {
				if (route.redirect) route.component = route.redirect;
				else route.component = defaultRedirect;
			});
		}
		return routeGroup;
	};

	const public_routes = asRoutes({
		home: {
			exact: true,
			path: '/',
			component: Home,
		},
		about: {
			path: '/about',
			component: About,
		},
		amc: {
			path: '/amc',
			component: NotFound,
		},
		// TODO : change to auth
		level_play: {
			path: '/level/play/:id',
			component: Level,
		},
		en: {
			// Route for switching language to english
			path: '/en',
			component: Home,
		},
		fr: {
			// Route for switching language to french
			path: '/fr',
			component: Home,
		},
	});

	const auth_routes = asAuthRoutes(SignIn, {
		dashboard: {
			path: '/dashboard',
			component: Dashboard,
		},
		classroom: {
			path: '/classroom/:id',
			component: Classroom,
		},
	});

	const non_auth_routes = asNonAuthRoutes(Home, {
		signin: {
			path: '/signin',
			component: SignIn,
		},
		signup: {
			path: '/signup',
			component: SignUpMenu,
		},
		signup_professor: {
			path: '/signup-professor',
			component: () => <SignUp userType={USER_TYPES.PROFESSOR} />,
		},
		signup_student: {
			path: '/signup-student',
			component: () => <SignUp userType={USER_TYPES.STUDENT} />,
		},
	});

	const error_routes = asRoutes({
		not_found: {
			path: '*',
			component: NotFound,
		},
	});

	const routes = {
		public: public_routes,
		auth: auth_routes,
		non_auth: non_auth_routes,
		error: error_routes,
	};

	return { routes };
};

export default useRoutes;