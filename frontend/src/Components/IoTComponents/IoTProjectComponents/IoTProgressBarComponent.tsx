import Button from '../../UtilsComponents/Button/Button';
import { IoTProgressBar } from '../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';

const IoTProgressBarComponent = ({
	component,
}: {
	component: IoTProgressBar;
}) => {
	return (
		<>
			<div className="my-progress mb-5">
				<div className="barOverflow">
					<div
						className="bar"
						style={{
							transform: `rotate(${(component.value / 100) * 180 + 45}deg)`,
						}}
					></div>
				</div>
				<span className="my-progress-span">{component.value}%</span>
			</div>
		</>
	);
};

export default IoTProgressBarComponent;