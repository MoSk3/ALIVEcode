import { IoTGenericComponentProps, StyledIoTGenericComponent } from './iotGenericComponentTypes';
import { IOT_COMPONENT_TYPE } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import IoTButtonComponent from '../IoTButtonComponent/IoTButtonComponent';
import IoTProgressBarComponent from '../IoTProgressBarComponent/IoTProgressBarComponent';
import IoTLogsComponent from '../IoTLogsComponent/IoTLogsComponent';
import { IoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { IoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';

const IoTGenericComponent = ({
	component,
	selectable,
	onSelect,
	setEditingComponent,
}: IoTGenericComponentProps) => {
	const [isHovering, setIsHovering] = useState(false);

	const renderSpecificComponent = (): React.ReactNode => {
		switch (component.type) {
			case IOT_COMPONENT_TYPE.BUTTON:
				return <IoTButtonComponent component={component as IoTButton} />;
			case IOT_COMPONENT_TYPE.PROGRESS_BAR:
				return (
					<IoTProgressBarComponent component={component as IoTProgressBar} />
				);
			case IOT_COMPONENT_TYPE.LOGS:
				return <IoTLogsComponent component={component as IoTLogs} />;
		}
	};

	return (
		<StyledIoTGenericComponent
			ishovering={isHovering ? 1 : 0}
			selectable={selectable ? 1 : 0}
			onMouseOver={() => !isHovering && setIsHovering(true)}
			onMouseLeave={() => isHovering && setIsHovering(false)}
			onClick={() => selectable && onSelect && onSelect()}
		>
			<div className="component">
				<label className="component-name">{component.name}</label>
				{renderSpecificComponent()}
				{setEditingComponent && (
					<FontAwesomeIcon
						onClick={() => setEditingComponent(component)}
						className="edit-component-btn"
						icon={faWrench}
						size="2x"
					/>
				)}
			</div>
		</StyledIoTGenericComponent>
	);
};

export default IoTGenericComponent;