import { Switch, Route } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import useRoutes from '../../state/hooks/useRoutes';


export const RouterSwitch = () => {
	const { user } = useContext(UserContext);

	const { routes } = useRoutes(user);

	return (
		<Switch>

			{
				Object.values(routes).map((route_group) => (
					Object.values(route_group).map(({ path, component, exact }: any, idx) => (
						<Route exact={exact ?? false} path={path} component={component} key={idx} />
					))
				))
			}

			{/* Private only 
			<Route path="/dashboard" component={user ? Dashboard : SignIn} />
			*/}


			{/* Public only */}
			{/* <Route path="/password-recovery" component={props.user ? Home : PasswordRecovery} /> 
			
			<Route path="/signup" component={user ? Home : SignUpMenu} />
			<Route path="/signin" component={user ? Home : SignIn} />

			<Route path="/signup-professor" component={() => user ? <Home /> : <SignUp userType={USER_TYPES.PROFESSOR} />} />
			<Route path="/signup-student" component={() => user ? <Home /> : <SignUp userType={USER_TYPES.STUDENT} />} />

			<Route path="/level/play/:levelId" component={user ? Level : SignIn} />
			*/}
			{/* All 
			<Route path="/about" component={About} />
*/}

			{/* 
			<Route exact path="/" component={Home} />
			<Route path="*" component={NotFound} />
			*/}
		</Switch>
	)
}