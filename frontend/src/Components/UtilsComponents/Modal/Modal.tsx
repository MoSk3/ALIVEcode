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

const Modal = ({
	children,
	title,
	open,
	size,
	hideFooter,
	closeButton,
	buttonVariant,
	onClose,
}: ModalProps) => {
	return (
		<StyledModal size={size} show={open} onHide={onClose}>
			<BootModal.Header closeButton>
				<BootModal.Title>{title}</BootModal.Title>
			</BootModal.Header>
			<BootModal.Body>{children}</BootModal.Body>
			{!hideFooter && (
				<BootModal.Footer>
					{(closeButton ?? true) && (
						<Button variant="secondary" onClick={onClose}>
							Close
						</Button>
					)}
					<Button variant={buttonVariant || 'primary'} onClick={onClose}>
						Save Changes
					</Button>
				</BootModal.Footer>
			)}
		</StyledModal>
	);
};

export default Modal;