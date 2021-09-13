import { MaintenanceBarProps, StyledMaintenanceBar } from './maintenanceBarTypes';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const MaintenanceBar = ({ maintenance, onClose }: MaintenanceBarProps) => {
	const { t } = useTranslation();

	return (
		<StyledMaintenanceBar>
			{!maintenance.started ? (
				<label className="maintenance-info">
					{t('msg.maintenance.upcoming', {
						startDate: maintenance.startDate,
						finishDate: maintenance.finishDate,
					})}
				</label>
			) : (
				<label className="maintenance-info">
					{t('msg.maintenance.ongoing', {
						startDate: maintenance.startDate,
						finishDate: maintenance.finishDate,
					})}
				</label>
			)}
			<label className="maintenance-title">{maintenance.name}</label>
			<FontAwesomeIcon
				className="close-icon"
				size="lg"
				icon={faTimes}
				onClick={onClose}
			></FontAwesomeIcon>
		</StyledMaintenanceBar>
	);
};

export default MaintenanceBar;
