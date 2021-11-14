import { IoTRouteCardProps, StyledRouteCard } from './iotRouteCardTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
	faLevelUpAlt,
	faTrash,
	faWrench,
} from '@fortawesome/free-solid-svg-icons';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTRouteSettings from '../IoTRouteSettings/IoTRouteSettings';

/**
 * Component that shows an IoTRoute with its information
 * (name, path)
 *
 * @param {IoTRoute} route IoTRoute object
 *
 * @author MoSk3
 */
const IoTRouteCard = ({ route }: IoTRouteCardProps) => {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<StyledRouteCard className="mb-2">
				<div>
					<div>{route.name}</div>
					<div>
						<FontAwesomeIcon
							className="mr-2 ml-2"
							size="xs"
							icon={faLevelUpAlt}
							rotation={90}
						/>
						{route.path}
					</div>
				</div>
				<div>
					<FontAwesomeIcon
						className="icon"
						icon={faWrench}
						onClick={() => setSettingsOpen(true)}
					/>
					<FontAwesomeIcon
						className="icon"
						icon={faTrash}
						onClick={() => setDeleteConfirmOpen(true)}
					/>
				</div>
			</StyledRouteCard>
			<Modal
				title="Route settings"
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
				size="xl"
			>
				<IoTRouteSettings route={route} />
			</Modal>
			<AlertConfirm
				title="Are you sure you want to delete this route"
				open={deleteConfirmOpen}
				onClose={() => setDeleteConfirmOpen(false)}
				onConfirm={() => console.log('DELETE!')}
				onCancel={() => console.log('CANCEL!')}
			/>
		</>
	);
};

export default IoTRouteCard;