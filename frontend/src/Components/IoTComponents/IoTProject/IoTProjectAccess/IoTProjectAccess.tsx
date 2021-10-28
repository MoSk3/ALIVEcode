import IconButton from '../../../DashboardComponents/IconButton/IconButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { IoTObjectCard } from '../../IoTObject/IoTObjectCard/IoTObjectCard';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import { IoTProjectSettingsProps } from '../IoTProjectSettings/IoTProjectSettingsTypes';
import { IoTProject } from '../../../../Models/Iot/IoTproject.entity';
import { plainToClass } from 'class-transformer';
import FormModal from '../../../UtilsComponents/FormModal/FormModal';
import Form from '../../../UtilsComponents/Form/Form';
import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import api from '../../../../Models/api';
import Modal from '../../../UtilsComponents/Modal/Modal';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';

export const IoTProjectAccess = ({
	project,
	setProject,
	canEdit,
}: IoTProjectSettingsProps) => {
	const [addObjectModalOpen, setAddObjectModalOpen] = useState(false);
	const [iotObjects, setIoTObjects] = useState<IoTObject[]>();
	const alert = useAlert();
	const { t } = useTranslation();

	useEffect(() => {
		const getObjects = async () => {
			const iotObjects = await api.db.users.iot.getObjects({});
			await project.getIoTObjects();

			setIoTObjects(iotObjects);
			setProject(plainToClass(IoTProject, project));
		};
		getObjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const iotObjectOptions = iotObjects?.flatMap(obj => {
		if (project.iotObjects?.find(o => o.id === obj.id)) return [];
		return {
			value: obj.id,
			display: obj.name,
		};
	});

	return (
		<>
			<div className="project-details-content-header">Access</div>
			<h6>
				IoTObjects{' '}
				<IconButton
					onClick={() => setAddObjectModalOpen(true)}
					icon={faPlus}
				></IconButton>
			</h6>
			{project.iotObjects ? (
				project.iotObjects.length > 0 ? (
					project.iotObjects.map((obj, idx) => (
						<IoTObjectCard key={idx} object={obj} />
					))
				) : (
					'No IoTObjects'
				)
			) : (
				<LoadingScreen relative />
			)}

			{iotObjectOptions?.length === 0 ? (
				<Modal
					title="Add an IoTObject to the project"
					open={addObjectModalOpen}
					onClose={() => setAddObjectModalOpen(false)}
				>
					You have no IoTObject to add to the project
				</Modal>
			) : (
				<FormModal
					onSubmit={res => {
						const iotObject = plainToClass(IoTObject, res.data);
						project.iotObjects?.push(iotObject);
						setProject(plainToClass(IoTProject, project));
						setAddObjectModalOpen(false);
						alert.success(t('iot.project.add_object.success'));
					}}
					title="Add an IoTObject to the project"
					open={addObjectModalOpen}
					onClose={() => setAddObjectModalOpen(false)}
				>
					<Form
						action="POST"
						name="iot_project_object"
						url={`iot/projects/${project.id}/objects`}
						inputGroups={[
							{
								name: 'id',
								required: true,
								default: project.name,
								inputType: 'select',
								selectOptions: iotObjectOptions,
							},
						]}
					/>
				</FormModal>
			)}
		</>
	);
};

export default IoTProjectAccess;