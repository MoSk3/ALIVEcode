import { IoTGenericComponentProps, StyledIoTGenericComponent } from './iotGenericComponentTypes';
import { IOT_COMPONENT_TYPE } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTButtonComponent from '../IoTButtonComponent';
import IoTProgressBarComponent from '../IoTProgressBarComponent/IoTProgressBarComponent';
import IoTLogsComponent from '../IoTLogsComponent/IoTLogsComponent';
import { IoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IoTGenericComponent = ({ component }: IoTGenericComponentProps) => {
	const renderSpecificComponent = (): React.ReactNode => {
		switch (component.type) {
			case IOT_COMPONENT_TYPE.BUTTON:
				return <IoTButtonComponent component={component} />;
			case IOT_COMPONENT_TYPE.PROGRESS_BAR:
				return (
					<IoTProgressBarComponent component={component as IoTProgressBar} />
				);
			case IOT_COMPONENT_TYPE.LOGS:
				return <IoTLogsComponent component={component as IoTLogs} />;
		}
	};

	return (
		<StyledIoTGenericComponent>
			<div
				style={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{renderSpecificComponent()}
				<FontAwesomeIcon
					className="edit-component-btn"
					icon={faWrench}
					size="2x"
				></FontAwesomeIcon>
			</div>
		</StyledIoTGenericComponent>
	);
};

export default IoTGenericComponent;