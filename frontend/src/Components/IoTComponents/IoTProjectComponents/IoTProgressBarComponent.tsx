import { IoTProgressBar } from '../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';

const IoTProgressBarComponent = ({
	component,
}: {
	component: IoTProgressBar;
}) => {
	const percentage = component.value / component.getMax();

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h4 style={{ textAlign: 'center' }}>{component.name}</h4>
			<div className="my-progress mb-5">
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
		</div>
	);
};

export default IoTProgressBarComponent;