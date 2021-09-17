import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import {
	MaintenanceCardProps,
	StyledMaintenanceCard,
} from './maintenanceCardTypes';

const MaintenanceCard = ({ maintenance }: MaintenanceCardProps) => {
	const { t } = useTranslation();

	const renderStatus = () => {
		if (!maintenance.started && !maintenance.finished) {
			return (
				<label className="maintenance-status-upcoming">
					{t('msg.maintenance.status.upcoming')}
				</label>
			);
		}
		if (maintenance.started && !maintenance.finished) {
			return (
				<label className="maintenance-status-ongoing">
					{t('msg.maintenance.status.ongoing')}
				</label>
			);
		}
		return (
			<label className="maintenance-status-finished">
				{t('msg.maintenance.status.finished')}
			</label>
		);
	};

	return (
		<StyledMaintenanceCard>
			<div className="maintenance-left">
				<div className="maintenance-header">
					<label className="maintenance-title">{maintenance.name}</label>
					{' - '}
					<label className="maintenance-time">
						{formatDate(maintenance.startDate, t)}
					</label>
					{' - '}
					<label className="maintenance-time">
						{formatDate(maintenance.finishDate, t)}
					</label>
				</div>
				<div className="maintenance-description">
					{maintenance.description || t('msg.maintenance.no_desc')}
				</div>
			</div>
			<div>Status : {renderStatus()}</div>
		</StyledMaintenanceCard>
	);
};

export default MaintenanceCard;