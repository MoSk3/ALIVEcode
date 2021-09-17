import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BackArrowProps } from './backArrowTypes';

const BackArrow = ({ color, maintenancePopUp }: BackArrowProps) => {
	const history = useHistory();

	return (
		<FontAwesomeIcon
			onClick={() => history.goBack()}
			style={{
				cursor: 'pointer',
				position: 'fixed',
				bottom: maintenancePopUp ? '140px' : '25px',
				left: '25px',
				zIndex: 100,
			}}
			icon={faArrowLeft}
			size="3x"
			color={color || '#0177bc'}
		/>
	);
};

export default BackArrow;