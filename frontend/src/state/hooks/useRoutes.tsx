import { RouteComponentProps } from 'react-router-dom';
import { Professor, Student } from '../../Models/User/user.entity';
import Classroom from '../../Pages/Classroom/Classroom';
import Course from '../../Pages/Course/Course';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import Home from '../../Pages/Home/Home';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import SignUp from '../../Pages/Account/SignUp/SignUp';
import { USER_TYPES } from '../../Types/userTypes';
import Level from '../../Pages/Level/Level';
import SignUpMenu from '../../Pages/Account/SignUpMenu/SignUpMenu';
import About from '../../Pages/About/About';
import AliveIa from '../../Pages/ALIVEIA/AliveIa';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import AccountPage from '../../Pages/Account/AccountInfo/AccountPage';
import CourseForm from '../../Components/CourseComponents/CourseForm/CourseForm';
import ClassroomForm from '../../Components/ClassroomComponents/ClassroomForm/ClassroomForm';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import IoTHome from '../../Pages/IoT/IoTHome/IoTHome';
import IoTProject from '../../Pages/IoT/IoTProject/IoTProject';
import IoTProjectCreate from '../../Components/IoTComponents/IoTProject/IotProjectForm/IoTProjectCreate';
import IoTDashboard from '../../Pages/IoT/IoTDashboard/IoTDashboard';
import LevelForm from '../../Components/LevelComponents/LevelForm/LevelForm';
import LevelBrowse from '../../Pages/Level/LevelBrowse/LevelBrowse';
import LevelList from '../../Pages/Level/LevelList/LevelList';
import LevelFormMenu from '../../Pages/Level/LevelFormMenu/LevelFormMenu';
import Test from '../../Pages/Test/Test';
import { useHistory } from 'react-router';
import { MaintenanceError } from '../../Pages/Errors/MaintenanceError/MaintenanceError';
import MaintenanceMenu from '../../Pages/SiteStatus/MaintenanceMenu/MaintenanceMenu';

type component =
	| React.ComponentType<RouteComponentProps<any>>
	| React.ComponentType<any>;

export interface Route {
	path: string;
	exact?: boolean;
	component?: component;
	maintenanceExempt?: boolean;

	// Do not set manually
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
	const { user, maintenance } = useContext(UserContext);
	const history = useHistory();

	const asRoutes = <T extends RoutesGroup<Route>>(routeGroup: T): T => {
		Object.values(routeGroup).forEach(route => {
			route.hasAccess = route.hasAccess ?? true;
			if (
				maintenance &&
				maintenance.started &&
				!maintenance.finished &&
				!route.maintenanceExempt &&
				route.hasAccess
			) {
				if (!user || !user.isAdmin) {
					route.component = MaintenanceError;
					route.hasAccess = false;
				}
			}
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
		test: {
			path: '/test',
			component: Test,
		},
		home: {
			exact: true,
			path: '/',
			component: Home,
			maintenanceExempt: true,
		},
		ai: {
			path: '/aliveai',
			component: AliveIa,
			maintenanceExempt: true,
		},
		about: {
			path: '/about',
			component: About,
			maintenanceExempt: true,
		},
		amc: {
			path: '/amc',
			component: NotFound,
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
		level_alive: {
			path: '/level/play/alive',
			component: () => <Level type="ALIVE" editMode />,
		},
		level_code: {
			path: '/level/play/code',
			component: () => <Level type="code" editMode />,
		},
		maintenances: {
			path: '/maintenances',
			exact: true,
			maintenanceExempt: true,
			component: MaintenanceMenu,
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
			component: IoTProjectCreate,
		},
		iot_project: {
			path: '/iot/projects/:id',
			component: IoTProject,
		},
		level_list: {
			path: '/level',
			exact: true,
			component: LevelList,
		},
		level_edit: {
			path: '/level/edit/:id',
			component: () => <Level editMode />,
		},
		level_browse: {
			path: '/level/browse',
			component: LevelBrowse,
		},
		level_play: {
			path: '/level/play/:id',
			component: Level,
		},
		level_create: {
			path: '/level/create',
			exact: true,
			component: LevelFormMenu,
		},
		level_create_alive: {
			path: '/level/create/alive',
			component: () => <LevelForm type="ALIVE" />,
		},
		level_create_code: {
			path: '/level/create/code',
			component: () => <LevelForm type="code" />,
		},
		level_create_ai: {
			path: '/level/create/ai',
			component: () => <LevelForm type="AI" />,
		},
	});

	const non_auth_routes = asNonAuthRoutes(Home, {
		signin: {
			path: '/signin',
			component: SignIn,
			maintenanceExempt: true,
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
			maintenanceExempt: true,
		},
	});

	const routes = {
		public: public_routes,
		auth: auth_routes,
		non_auth: non_auth_routes,
		error: error_routes,
	};

	return {
		routes,
		goTo: (path: string) => history.push(path),
		goBack: () => history.goBack(),
	};
};

export default useRoutes;