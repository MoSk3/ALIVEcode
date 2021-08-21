import { iotDashboardProps } from './iotDashboardTypes';
import { useEffect, useState } from 'react';
import api from '../../../Models/api';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import CardContainer from '../../../Components/UtilsComponents/CardContainer/CardContainer';
import SmallCard from '../../../Components/UtilsComponents/Cards/SmallCard/SmallCard';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import IoTObjectCreate from '../../../Components/IoTComponents/IoTObject/IotObjectForm/IoTObjectCreate';

const StyledDiv = styled(FillContainer)`
	padding: 2vw;
`;

const IoTDashboard = (props: iotDashboardProps) => {
	const [projects, setProjects] = useState<IoTProject[]>();
	const [objects, setObjects] = useState<IoTObject[]>();
	const { routes } = useRoutes();
	const history = useHistory();
	// TODO: ADD MODAL FORM GENERIC
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const getProjects = async () => {
			const projects = await api.db.users.iot.getProjects();
			const objects = await api.db.users.iot.getObjects();
			setProjects(projects);
			setObjects(objects);
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
					icon={faPlus}
					onIconClick={() => history.push(routes.auth.create_iot_project.path)}
					height="200px"
					className="iot-container"
					title="My projects"
				>
					{projects && projects.length > 0 ? (
						projects.map((p, idx) => (
							<SmallCard
								key={idx}
								title={p.name}
								to={routes.auth.iot_project.path.replace(':id', p.id)}
							/>
						))
					) : (
						<div>Aucun projet</div>
					)}
				</CardContainer>
				<CardContainer
					icon={faPlus}
					onIconClick={() => setOpen(!open)}
					height="200px"
					className="iot-container"
					title="My connected objects"
				>
					{objects && objects.length > 0 ? (
						objects.map((p, idx) => (
							<SmallCard
								key={idx}
								title={p.name}
								to={routes.auth.iot_project.path.replace(':id', p.id)}
							/>
						))
					) : (
						<div>Aucun objet connecté</div>
					)}
				</CardContainer>
			</div>
			{open && <IoTObjectCreate />}
		</StyledDiv>
	);
};

export default IoTDashboard;