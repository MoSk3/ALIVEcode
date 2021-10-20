import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import { StyledIoTProgressBar } from './iotProgressBarComponentTypes';

const IoTProgressBarComponent = ({
	component,
}: {
	component: IoTProgressBar;
}) => {
	const percentage = component.value / component.getMax();

	return (
		<StyledIoTProgressBar>
			<h4>{component.name}</h4>
			<div className="my-progress">
				<div className="barOverflow">
					<div
						className="bar"
						style={{
							transform: `rotate(${
								(percentage <= 1 ? percentage : 1) * 180 + 45
							}deg)`,
						}}
					></div>
				</div>
				<span className="my-progress-span">
					{component.value}
					{component.isPercentage && '%'}
				</span>
			</div>
		</StyledIoTProgressBar>
	);
};

export default IoTProgressBarComponent;