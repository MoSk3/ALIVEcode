import { Row } from 'react-bootstrap';
import { useMemo } from 'react';
import { createDefaultIoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { createDefaultIoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import { createDefaultIoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import {
	StyledIoTComponentCreator,
	IoTComponentCreatorProps,
} from './iotComponentCreatorTypes';

export const IoTComponentCreator = ({ onSelect }: IoTComponentCreatorProps) => {
	const components = useMemo(
		() => [
			createDefaultIoTProgressBar(),
			createDefaultIoTButton(),
			createDefaultIoTLogs(),
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