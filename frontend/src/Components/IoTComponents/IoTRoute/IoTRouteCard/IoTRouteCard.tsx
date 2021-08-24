import styled from 'styled-components';
import { IoTRouteCardProps } from './iotRouteCardTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
	faLevelUpAlt,
	faTrash,
	faWrench,
} from '@fortawesome/free-solid-svg-icons';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';

const StyledRouteCard = styled.div`
	background-color: rgba(var(--primary-color-rgb), 0.6);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px 10px 5px 10px;

	.icon {
		color: var(--foreground-color);
		transition: 0.1s;
		cursor: pointer;
		margin-left: 10px;
	}

	.icon:hover {
		color: rgba(var(--foreground-color-rgb), 0.3);
	}
`;

const IoTRouteCard = ({ route, key }: IoTRouteCardProps) => {
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

	return (
		<>
			<StyledRouteCard key={key} className="mb-2">
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
			/>
		</>
	);
};

export default IoTRouteCard;