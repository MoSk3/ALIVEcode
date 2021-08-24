import styled from 'styled-components';
import { AlertConfirmProps } from './alertConfirmTypes';
import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';

const StyledModal = styled(Modal)`
	.modal-content {
		background-color: var(--background-color);
		color: var(--foreground-color);
	}
`;

const AlertConfirm = (props: AlertConfirmProps) => {
	return (
		<StyledModal hideFooter size="lg" {...props}>
			<Button variant="primary">test</Button>
		</StyledModal>
	);
};

export default AlertConfirm;