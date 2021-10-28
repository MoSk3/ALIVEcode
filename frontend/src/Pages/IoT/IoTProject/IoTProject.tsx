import { IoTProjectProps, IoTProjectTabs, StyledIoTProject } from './iotProjectTypes';
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
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
import { faRoute, faCog, faPlug } from '@fortawesome/free-solid-svg-icons';
import IoTProjectBody from '../../../Components/IoTComponents/IoTProject/IoTProjectBody/IotProjectBody';
import IoTProjectAccess from '../../../Components/IoTComponents/IoTProject/IoTProjectAccess/IoTProjectAccess';
import IoTProjectRoutes from '../../../Components/IoTComponents/IoTProject/IoTProjectRoutes/IoTProjectRoutes';
import IoTProjectSettings from '../../../Components/IoTComponents/IoTProject/IoTProjectSettings/IoTProjectSettings';
import {
	IoTProjectContext,
	IoTProjectContextValues,
} from '../../../state/contexts/IoTProjectContext';
import { IotRoute } from '../../../Models/Iot/IoTroute.entity';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

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
	const forceUpdate = useForceUpdate();

	const canEdit = user?.id === project?.creator?.id;

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

	const addRoute = useCallback(
		(route: IotRoute) => {
			console.log('WAD');
			if (!canEdit || !project) return;
			project.routes.push(route);
			setProject(project);
		},
		[canEdit, project],
	);

	const addIoTObject = useCallback(
		(iotObject: IoTObject) => {
			if (!canEdit || !project) return;
			project.iotObjects?.push(iotObject);
			setProject(project);
			alert.success(t('iot.project.add_object.success'));
		},
		[alert, canEdit, project, t],
	);

	const loadIoTObjects = useCallback(async () => {
		if (!project) return;
		await project.getIoTObjects();
		setProject(project);
		forceUpdate();
	}, [project, forceUpdate]);

	const updateProjectData = useCallback(
		(
			name: string,
			description: string,
			access: IOTPROJECT_ACCESS,
			interactRights: IOTPROJECT_INTERACT_RIGHTS,
		) => {
			if (!project) return;
			project.name = name;
			project.description = description;
			project.access = access;
			project.interactRights = interactRights;
			setProject(project);
			forceUpdate();
		},
		[project, forceUpdate],
	);

	const providerValues: IoTProjectContextValues = useMemo(() => {
		return {
			project: project ?? null,
			canEdit,
			addRoute,
			addIoTObject,
			loadIoTObjects,
			updateProjectData,
		};
	}, [project, canEdit, addRoute, addIoTObject, loadIoTObjects]);

	if (!project) {
		return <LoadingScreen />;
	}

	const getTabContent = () => {
		switch (selectedTab) {
			case 'settings':
				return <IoTProjectSettings />;
			case 'routes':
				return <IoTProjectRoutes />;
			case 'access':
				return <IoTProjectAccess />;
		}
	};

	return (
		<StyledIoTProject>
			<IoTProjectContext.Provider value={providerValues}>
				<Row className="h-100">
					<Col sm="4" id="project-details">
						<Row className="project-name">{project.name}</Row>
						<Row className="project-details-body">
							<Col className="project-details-tabs">
								<Row
									className={
										'project-details-tab ' +
										(selectedTab === 'settings' &&
											'project-details-tab-selected')
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
			</IoTProjectContext.Provider>
		</StyledIoTProject>
	);
};

export default IoTProject;