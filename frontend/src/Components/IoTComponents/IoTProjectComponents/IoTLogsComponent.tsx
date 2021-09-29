import { IoTLogs, IoTLogModel } from '../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { formatDate } from '../../../Types/formatting';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const IoTLogsComponent = ({ component }: { component: IoTLogs }) => {
	const { t } = useTranslation();

	useEffect(() => {
		const interval = setInterval(() => {
			component.clearLogs();
			//component.addLog('YASSS');
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [component]);

	return (
		<div>
			<div>{component.id}</div>
			<div>
				{component.value.length <= 0 ? (
					<label>No logs available</label>
				) : (
					component.value.map((l: IoTLogModel, idx) => (
						<label key={idx}>
							{formatDate(l.date, t)}
							{l.text}
						</label>
					))
				)}
			</div>
		</div>
	);
};

export default IoTLogsComponent;