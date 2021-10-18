import { IoTButton } from "../../../Models/Iot/IoTProjectClasses/Components/IoTButton";
import Button from '../../UtilsComponents/Button/Button';

const IoTButtonComponent = ({ component }: { component: IoTButton }) => {
	return (
		<div
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Button variant="primary">{component.value}</Button>
		</div>
	);
};

export default IoTButtonComponent;