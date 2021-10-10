import { IoTRouteCardProps, StyledRouteCard } from './iotRouteCardTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
	faLevelUpAlt,
	faTrash,
	faWrench,
} from '@fortawesome/free-solid-svg-icons';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';

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
					<FontAwesomeIcon className="icon" icon={faWrench} />
					<FontAwesomeIcon
						className="icon"
						icon={faTrash}
						onClick={() => setDeleteConfirmOpen(true)}
					/>
				</div>
			</StyledRouteCard>
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