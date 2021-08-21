import { iotDashboardProps } from './iotDashboardTypes';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import Link from '../../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import Button from '../../../Components/UtilsComponents/Button/Button';
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';

const StyledDiv = styled(FillContainer)`
	padding: 2vw;
`;

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
		<StyledDiv>
			<div>
				<h1>IoT Dashboard</h1>
			</div>
			<div>
				<CardContainer
					height="300px"
					className="iot-container"
					title="My projects"
				>
					{projects && projects.length > 0 ? (
						projects.map((p, idx) => (
							<div key={idx}>
								<Link
									dark
									to={routes.auth.iot_project.path.replace(':id', p.id)}
								>
									{p.name}
								</Link>
							</div>
						))
					) : (
						<div>Aucun projet</div>
					)}
				</CardContainer>
				<br />
				<Button to={routes.auth.create_iot_project.path} variant="secondary">
					Nouveau projet
				</Button>
			</div>
		</StyledDiv>
	);
};

export default IoTDashboard;