import { iotDashboardProps } from './iotDashboardTypes';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import Link from '../../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import Button from '../../../Components/UtilsComponents/Button/Button';

const IoTDashboard = (props: iotDashboardProps) => {
	const [projects, setProjects] = useState<IoTProject[]>();
	const { routes } = useRoutes();

	useEffect(() => {
		const getProjects = async () => {
			const projects = await api.db.users.iot.getProjects();
			setProjects(projects);
		};
		getProjects();
	}, []);

	return (
		<>
			<div>
				<h1>IoT Dashboard</h1>
			</div>
			<div>
				<h4>My projects</h4>
				{projects && projects.length > 0 ? (
					projects.map((p, idx) => (
						<div key={idx}>
							<Link to={routes.auth.iot_project.path.replace(':id', p.id)}>
								{p.name}
							</Link>
						</div>
					))
				) : (
					<div>Aucun projet</div>
				)}
				<br />
				<Button to={routes.auth.create_iot_project.path} variant="secondary">
					Nouveau projet
				</Button>
			</div>
		</>
	);
};

export default IoTDashboard;