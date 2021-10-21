import Button from '../../../UtilsComponents/Button/Button';
import { IoTButtonComponentProps } from './IoTButtonComponentTypes';

const IoTButtonComponent = ({ component }: IoTButtonComponentProps) => {
	return <Button variant="primary">{component.value}</Button>;
};

export default IoTButtonComponent;