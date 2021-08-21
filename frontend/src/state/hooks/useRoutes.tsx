import { RouteComponentProps } from 'react-router-dom';
import { Professor, Student } from '../../Models/User/user.entity';
import Classroom from '../../Pages/Classroom/Classroom';
import Course from '../../Pages/Course/Course';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import Home from '../../Pages/Home/Home';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import SignUp from '../../Pages/Account/SignUp/SignUp';
import { USER_TYPES } from '../../Types/userTypes';
import Level from '../../Pages/Level/SimulationLevel';
import SignUpMenu from '../../Pages/Account/SignUpMenu/SignUpMenu';
import About from '../../Pages/About/About';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import AccountPage from '../../Pages/Account/AccountInfo/AccountPage';
import CourseForm from '../../Components/CourseComponents/CourseForm/CourseForm';
import ClassroomForm from '../../Components/ClassroomComponents/ClassroomForm/ClassroomForm';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import IoTHome from '../../Pages/IoT/IoTHome/IoTHome';
import IoTDashboard from '../../Pages/IoT/IoTDashboard/IoTDashboard';
import IoTProject from '../../Pages/IoT/IoTProject/IoTProject';
import IoTProjectForm from '../../Components/IoTComponents/IoTProject/IotForm/IoTProjectForm';

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
				(route.accountType === Professor && !(user instanceof Professor)) ||
				(route.accountType === Student && !(user instanceof Student))
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
		code_play: {
			path: '/code',
			component: CodeLevel,
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
		iot: {
			exact: true,
			path: '/iot',
			component: IoTHome,
		},
	});

	const auth_routes = asAuthRoutes(SignIn, {
		dashboard: {
			path: '/dashboard',
			component: Dashboard,
		},
		create_classroom: {
			accountType: Professor,
			path: '/classroom/create',
			component: ClassroomForm,
		},
		join_classroom: {
			accountType: Student,
			path: '/classroom/join',
			component: ClassroomForm,
		},
		classroom: {
			path: '/classroom/:id',
			component: Classroom,
		},
		create_course: {
			path: '/course/create',
			component: CourseForm,
		},
		course: {
			path: '/course/:id',
			component: Course,
		},
		account: {
			path: '/account',
			component: AccountPage,
		},
		iot_dashboard: {
			path: '/iot/dashboard',
			component: IoTDashboard,
		},
		create_iot_project: {
			path: '/iot/projects/create',
			component: IoTProjectForm,
		},
		iot_project: {
			path: '/iot/projects/:id',
			component: IoTProject,
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