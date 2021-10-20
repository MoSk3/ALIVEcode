import { IoTButton } from "../../../Models/Iot/IoTProjectClasses/Components/IoTButton";
import Button from '../../UtilsComponents/Button/Button';

const IoTButtonComponent = ({ component }: { component: IoTButton }) => {
	return <Button variant="primary">{component.value}</Button>;
};

export default IoTButtonComponent;