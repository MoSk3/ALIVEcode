import { IoTProjectProps } from "./iotProjectTypes";
import { useEffect, useState, useContext } from 'react';
import { IoTProject as ProjectModel } from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';

const IoTProject = (props: IoTProjectProps) => {
	const [project, setProject] = useState<ProjectModel>();
	const history = useHistory();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);

	useEffect(() => {
		const getCourse = async () => {
			try {
				const project: ProjectModel = await api.db.iot.projects.get(
					props.match.params.id,
				);
				setProject(project);
			} catch (err) {
				history.push('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getCourse();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id, user]);

	if (!project) {
		return <LoadingScreen />;
	}

	return <div>{JSON.stringify(project)}</div>;
};

export default IoTProject;