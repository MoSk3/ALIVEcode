import { Switch, Route } from 'react-router-dom';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import Home from '../../Pages/Home/Home';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import About from '../../Pages/About/About';
import SignUp from '../../Pages/Account/SignUp/SignUp';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import SignUpMenu from '../../Pages/Account/SignUpMenu/SignUpMenu';
import { USER_TYPES } from '../../Types/userTypes';


export const RouterSwitch = () => {
	const { user } = useContext(UserContext);

	return (
		<Switch>
			{/* Private only */}
			<Route path="/dashboard" component={user ? Dashboard : Home} />


			{/* Public only */}
			{/* <Route path="/password-recovery" component={props.user ? Home : PasswordRecovery} /> */}
			<Route path="/signup" component={user ? Home : SignUpMenu} />
			<Route path="/signin" component={user ? Home : SignIn} />

			<Route path="/signup-professor" component={() => user ? <Home /> : <SignUp userType={USER_TYPES.PROFESSOR} />} />
			<Route path="/signup-student" component={() => user ? <Home /> : <SignUp userType={USER_TYPES.STUDENT} />} />

			{/* All */}
			<Route path="/about" component={About} />
			<Route exact path="/" component={Home} />
			<Route path="*" component={NotFound} />
		</Switch>
	)
}