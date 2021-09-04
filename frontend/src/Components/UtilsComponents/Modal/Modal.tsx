import { Modal as BootModal } from 'react-bootstrap';
import styled from 'styled-components';
import Button from '../Button/Button';
import { ModalProps } from './modalTypes';

const StyledModal = styled(BootModal)`
	.modal-content {
		background-color: var(--background-color);
	}

	.close {
		color: var(--foreground-color);
	}
`;

const Modal = (props: ModalProps) => {
	const {
		children,
		title,
		open,
		size,
		hideFooter,
		closeButton,
		buttonVariant,
		onClose,
		...other
	} = props;
	return (
		<StyledModal size={size} show={open} onHide={onClose} {...other}>
			<BootModal.Header closeButton={closeButton}>
				<BootModal.Title>{title}</BootModal.Title>
			</BootModal.Header>
			<BootModal.Body>{children}</BootModal.Body>
			{!hideFooter && (
				<BootModal.Footer>
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
					<Button variant={buttonVariant || 'primary'} onClick={onClose}>
						Save Changes
					</Button>
				</BootModal.Footer>
			)}
		</StyledModal>
	);
};

export default Modal;