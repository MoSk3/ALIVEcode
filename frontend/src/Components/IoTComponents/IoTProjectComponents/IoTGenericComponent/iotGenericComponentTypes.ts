import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';

export type IoTGenericComponentProps = {
	component: IoTComponent;
};

export const StyledIoTGenericComponent = styled(Col)`
	background-color: var(--bg-shade-one-color);
	margin: 5px !important;
	border-radius: 10px;

	.edit-component-btn {
		position: absolute;
		top: 5px;
		left: 5px;
		background-color: var(--bg-shade-four-color);
		padding: 8px;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.2s;
	}

	.edit-component-btn:hover {
		background-color: var(--contrast-color);
	}
`;