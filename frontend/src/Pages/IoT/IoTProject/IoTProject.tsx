import { IoTProjectProps, IoTProjectTabs, StyledIoTProject } from './iotProjectTypes';
import { useEffect, useState, useContext } from 'react';
import {
	IoTProject as ProjectModel,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRoute,
	faCog,
	faPlug,
	faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Form from '../../../Components/UtilsComponents/Form/Form';
import IconButton from '../../../Components/DashboardComponents/IconButton/IconButton';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import { IotRoute } from '../../../Models/Iot/IoTroute.entity';
import { plainToClass } from 'class-transformer';
import IoTRouteCard from '../../../Components/IoTComponents/IoTRoute/IoTRouteCard/IoTRouteCard';

const IoTProject = (props: IoTProjectProps) => {
	const [project, setProject] = useState<ProjectModel>();
	const [selectedTab, setSelectedTab] = useState<IoTProjectTabs>('settings');
	const [routeModalOpen, setRouteModalOpen] = useState(false);
	const history = useHistory();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);

	useEffect(() => {
		const getProject = async () => {
			try {
				const project: ProjectModel = await api.db.iot.projects.get(
					props.match.params.id,
				);
				await project.getRoutes();
				setProject(project);
			} catch (err) {
				history.push('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id, user]);

	if (!project) {
		return <LoadingScreen />;
	}

	const getTabContent = () => {
		switch (selectedTab) {
			case 'settings':
				return (
					<>
						<div className="project-details-content-header">Settings</div>
						<Form
							onSubmit={res => {
								const updatedProject: ProjectModel = plainToClass(
									ProjectModel,
									res.data,
								);
								updatedProject.routes = project.routes;
								setProject(updatedProject);
							}}
							action="UPDATE"
							buttonText="update"
							name="update_iot_project"
							url={`iot/projects/${project.id}`}
							inputGroups={[
								{
									name: 'name',
									required: true,
									default: project.name,
									inputType: 'text',
								},
								{
									name: 'description',
									required: true,
									default: project.description,
									inputType: 'text',
								},
								{
									name: 'access',
									required: true,
									inputType: 'select',
									default: project.access,
									selectOptions: IOTPROJECT_ACCESS,
								},
								{
									name: 'interactRights',
									required: true,
									default: project.interactRights,
									inputType: 'select',
									selectOptions: IOTPROJECT_INTERACT_RIGHTS,
								},
							]}
						/>
					</>
				);
			case 'routes':
				return (
					<>
						<div className="project-details-content-header">
							<label className="mr-2">Routes</label>
							<IconButton
								icon={faPlus}
								onClick={() => setRouteModalOpen(true)}
							/>
						</div>
						<div>
							{project.routes.length > 0 ? (
								project.routes.map((r, idx) => (
									<IoTRouteCard key={idx} route={r} />
								))
							) : (
								<label className="disabled-text">No route</label>
							)}
						</div>
						<FormModal
							title="New route"
							onSubmit={res => {
								const resRoute: IotRoute = res.data;
								console.log(resRoute);
								project.routes.push(resRoute);
								setProject(project);
								setRouteModalOpen(false);
							}}
							onClose={() => setRouteModalOpen(false)}
							open={routeModalOpen}
						>
							<Form
								action="POST"
								buttonText="Create"
								name="create_iot_route"
								url={`iot/projects/${project.id}/routes`}
								inputGroups={[
									{
										name: 'name',
										required: true,
										inputType: 'text',
									},
									{
										name: 'path',
										required: true,
										inputType: 'text',
									},
								]}
							/>
						</FormModal>
					</>
				);
			case 'access':
				return (
					<>
						<div className="project-details-content-header">Access</div>
					</>
				);
		}
	};

	return (
		<StyledIoTProject>
			<Row className="h-100">
				<Col sm="4" id="project-details">
					<Row className="project-name">{project.name}</Row>
					<Row className="project-details-body">
						<Col className="project-details-tabs">
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'settings' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('settings')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faCog}
								/>
								Settings
							</Row>
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'routes' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('routes')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faPlug}
								/>
								Routes
							</Row>
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'access' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('access')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faRoute}
								/>
								Access
							</Row>
						</Col>
						<Col className="project-details-content">{getTabContent()}</Col>
					</Row>
				</Col>
				<Col sm="8" id="project-body">
					<Row className="project-top-row"></Row>
				</Col>
			</Row>
		</StyledIoTProject>
	);
};

export default IoTProject;