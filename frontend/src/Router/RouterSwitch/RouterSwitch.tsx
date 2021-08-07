import { Switch, Route } from 'react-router-dom';
import useRoutes from '../../state/hooks/useRoutes';

export const RouterSwitch = () => {
	// Check in useRoutes hook to see the registered routes
	const { routes } = useRoutes();

	return (
		<Switch>
			{Object.values(routes).map(route_group =>
				Object.values(route_group).map(
					({ path, component, exact }: any, idx) => (
						<Route
							exact={exact ?? false}
							path={path}
							component={component}
							key={idx}
						/>
					),
				),
			)}
		</Switch>
	);
};