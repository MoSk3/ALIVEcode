import { Row } from 'react-bootstrap';
import { useMemo } from 'react';
import { createDefaultIoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { createDefaultIoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { createDefaultIoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import { createDefaultIoTLed } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLed';
import {
	StyledIoTComponentCreator,
	IoTComponentCreatorProps,
} from './iotComponentCreatorTypes';
import { createDefaultIoTLabel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLabel';

export const IoTComponentCreator = ({ onSelect }: IoTComponentCreatorProps) => {
	const components = useMemo(
		() => [
			createDefaultIoTProgressBar(),
			createDefaultIoTButton(),
			createDefaultIoTLogs(),
			createDefaultIoTLed(),
			createDefaultIoTLabel(),
		],
		[],
	);

	return (
		<StyledIoTComponentCreator>
			<Row>
				{components.map(c => (
					<IoTGenericComponent
						selectable
						onSelect={() => onSelect(c)}
						component={c}
					></IoTGenericComponent>
				))}
			</Row>
		</StyledIoTComponentCreator>
	);
};

export default IoTComponentCreator;