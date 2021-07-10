import { Switch, Route } from 'react-router-dom';
import { RouterSwitchProps } from './routerSwitchTypes';
import Dashboard from '../../Pages/Dashboard/Dashboard';
import Home from '../../Pages/Home/Home';
import { NotFound } from '../../Pages/Errors/NotFound/NotFound';
import About from '../../Pages/About/About';
import SignUp from '../../Pages/Account/SignUp/SignIn';
import SignIn from '../../Pages/Account/SignIn/SignIn';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';


export const RouterSwitch = () => {
	const { user } = useContext(UserContext);

	return (
		<Switch>
			{/* Private only */}
			<Route path="/dashboard" component={user ? Dashboard : Home} />


			{/* Public only */}
			{/* <Route path="/password-recovery" component={props.user ? Home : PasswordRecovery} /> */}
			<Route path="/signup" component={user ? Home : SignUp} />
			<Route path="/signin" component={user ? Home : SignIn} />

			{/* All */}
			<Route path="/about" component={About} />
			<Route exact path="/" component={Home} />
			<Route path="*" component={NotFound} />
		</Switch>
	)
}