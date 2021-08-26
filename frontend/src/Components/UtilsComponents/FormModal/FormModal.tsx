import { cloneElement, isValidElement } from 'react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import Button from '../Button/Button';
import { FormModalProps } from './formModalTypes';

const StyledModal = styled(Modal)`
	.modal-content {
		background-color: var(--background-color);
	}

	.close {
		color: var(--foreground-color);
	}
`;

const FormModal = ({
	children: form,
	title,
	open,
	closeButton,
	buttonVariant,
	onClose,
	onSubmit,
}: FormModalProps) => {
	const makeChildrenWithProps = () => {
		return (
			form && isValidElement(form) && cloneElement(form as any, { onSubmit })
		);
	};

	return (
		<StyledModal show={open} onHide={onClose}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{makeChildrenWithProps()}</Modal.Body>
			<Modal.Footer>
				{(closeButton ?? true) && (
					<Button variant="secondary" onClick={onClose}>
						Close
					</Button>
				)}
				<Button variant={buttonVariant || 'primary'} onClick={onClose}>
					Save Changes
				</Button>
			</Modal.Footer>
		</StyledModal>
	);
};

export default FormModal;