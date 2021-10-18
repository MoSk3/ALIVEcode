import { IoTLogs, IoTLogModel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { formatDate } from '../../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { StyledIoTLogsComponent } from './iotLogsComponentTypes';

const IoTLogsComponent = ({ component }: { component: IoTLogs }) => {
	const { t } = useTranslation();

	useEffect(() => {
		component.clearLogs();
		component.addLog(
			'Jihène Rezgui est rentrée dans le stationnement avec la plaque H2C421',
		);
		component.addLog(
			'Enric Soldevila est rentrée dans le stationnement avec la plaque G9XOCP',
		);
		component.addLog(
			"Quelqu'un de non identifié a essayé de rentrer dans le stationnement avec la plaque P4S19C",
		);
	}, [component]);

	return (
		<StyledIoTLogsComponent>
			<div className="log-content">
				<div className="log-title">{component.name}</div>
				<div className="log-entries">
					{component.value.length <= 0 ? (
						<label>No logs available</label>
					) : (
						component.value.map((l: IoTLogModel, idx) => (
							<label key={idx}>
								<span style={{ color: 'gray' }}>{formatDate(l.date, t)}</span> :{' '}
								{l.text}
							</label>
						))
					)}
				</div>
			</div>
		</StyledIoTLogsComponent>
	);
};

export default IoTLogsComponent;