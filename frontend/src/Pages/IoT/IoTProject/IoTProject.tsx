import { IoTProjectProps, IoTProjectTabs, StyledIoTProject } from './iotProjectTypes';
import { useEffect, useState, useContext } from 'react';
import { IoTProject as ProjectModel } from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faCog, faPlug } from '@fortawesome/free-solid-svg-icons';
import IoTProjectBody from '../../../Components/IoTComponents/IoTProject/IotProjectBody';
import IoTProjectAccess from '../../../Components/IoTComponents/IoTProject/IoTProjectAccess/IoTProjectAccess';
import IoTProjectRoutes from '../../../Components/IoTComponents/IoTProject/IoTProjectRoutes/IoTProjectRoutes';
import IoTProjectSettings from '../../../Components/IoTComponents/IoTProject/IoTProjectSettings/IoTProjectSettings';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author MoSk3
 */
const IoTProject = (props: IoTProjectProps) => {
	const [project, setProject] = useState<ProjectModel>();
	const [selectedTab, setSelectedTab] = useState<IoTProjectTabs>('settings');
	const history = useHistory();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);

	useEffect(() => {
		const getProject = async () => {
			try {
				const project: ProjectModel = await api.db.iot.projects.get({
					id: props.match.params.id,
				});
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
				return <IoTProjectSettings setProject={setProject} project={project} />;
			case 'routes':
				return <IoTProjectRoutes setProject={setProject} project={project} />;
			case 'access':
				return <IoTProjectAccess setProject={setProject} project={project} />;
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
					<IoTProjectBody project={project} />
				</Col>
			</Row>
		</StyledIoTProject>
	);
};

export default IoTProject;