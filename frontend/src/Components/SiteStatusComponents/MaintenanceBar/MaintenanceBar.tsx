import { MaintenanceBarProps, StyledMaintenanceBar } from './maintenanceBarTypes';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from '../../UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';

const MaintenanceBar = ({ maintenance, onClose }: MaintenanceBarProps) => {
	const { t } = useTranslation();
	const { routes } = useRoutes();

	return (
		<StyledMaintenanceBar>
			<label className="maintenance-info">
				{!maintenance.started
					? t('msg.maintenance.upcoming', {
							startDate: maintenance.startDate,
							finishDate: maintenance.finishDate,
					  })
					: t('msg.maintenance.ongoing', {
							startDate: maintenance.startDate,
							finishDate: maintenance.finishDate,
					  })}{' '}
				<Link dark to={routes.public.maintenances.path}>
					More info
				</Link>
			</label>
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
