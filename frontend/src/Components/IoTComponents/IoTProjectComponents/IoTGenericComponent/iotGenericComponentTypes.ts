import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';

export type IoTGenericComponentProps = {
	component: IoTComponent;
	setEditingComponent?: (component: IoTComponent) => void;
};

export const StyledIoTGenericComponent = styled(Col)`
	background-color: var(--bg-shade-one-color);
	margin: 5px !important;
	border-radius: 10px;

	.edit-component-btn {
		position: absolute;
		top: 5px;
		left: 5px;
		background-color: var(--bg-shade-three-color);
		padding: 8px;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.2s;
		${({ isHovering }: any) => (isHovering ? 'opacity: 1;' : 'opacity: 0;')}
	}

	.edit-component-btn:hover {
		background-color: var(--contrast-color);
	}

	.component-name {
		margin-bottom: 0;
		font-size: 1.5em;
		font-weight: 500;
		text-align: center;
		padding-left: 30px;
		padding-right: 30px;
	}
`;