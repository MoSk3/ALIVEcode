import { iotHomeProps } from './iotHomeTypes';
import useRoutes from '../../../state/hooks/useRoutes';
import Link from '../../../Components/UtilsComponents/Link/Link';

const IoTHome = (props: iotHomeProps) => {
	const { routes } = useRoutes();

	return (
		<>
			<div>
				<h1>IoT Home Page</h1>
			</div>
			<div>
				<Link to={routes.auth.iot_dashboard.path}>IoT Dashboard</Link>
			</div>
		</>
	);
};

export default IoTHome;