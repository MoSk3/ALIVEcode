import { Maintenance } from '../../../Models/Maintenance/maintenance.entity';
import styled from 'styled-components';

export type MaintenanceCardProps = {
	maintenance: Maintenance;
};

export const StyledMaintenanceCard = styled.div`
	padding: 30px 50px 30px 30px;
	border-radius: 10px;
	background-color: var(--primary-color);
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;

	.maintenance-left {
		padding-right: 50px;
	}

	.maintenance-header {
		margin-bottom: 10px;
	}

	.maintenance-title {
		font-size: 1.5em;
		margin-right: 10px;
	}

	.maintenance-description {
		text-align: justify;
	}

	.maintenance-time {
		color: var(--contrast-color);
		font-weight: bold;
		font-size: 1.2em;
		margin-right: 10px;
		margin-left: 10px;
	}

	.maintenance-status-upcoming {
		color: orange;
		font-weight: bold;
	}

	.maintenance-status-finished {
		color: rgb(50, 50, 50);
		font-weight: bold;
	}
	.maintenance-status-ongoing {
		color: lime;
		font-weight: bold;
	}
`;