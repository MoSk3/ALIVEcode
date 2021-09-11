import styled from 'styled-components';
import { AlertConfirmProps } from './alertConfirmTypes';
import Modal from '../../Modal/Modal';
import Button from '../../Button/Button';
import { useTranslation } from 'react-i18next';

const StyledModal = styled(Modal)`
	.modal-content {
		background-color: var(--background-color);
		color: white;
	}

	.modal-header {
		background-color: var(--contrast-color);
		display: block;
		text-align: center;
	}

	.modal-body {
		display: flex;
		justify-content: space-evenly;
	}
`;

const AlertConfirm = ({
	onClose,
	onConfirm,
	onCancel,
	...other
}: AlertConfirmProps) => {
	const { t } = useTranslation();

	return (
		<StyledModal closeButton={false} hideFooter size="md" centered {...other}>
			<Button
				padding="15px"
				variant="primary"
				onClick={() => {
					onClose();
					onCancel && onCancel();
				}}
			>
				{t('msg.cancel')}
			</Button>
			<Button
				padding="15px"
				variant="danger"
				onClick={() => {
					onClose();
					onConfirm && onConfirm();
				}}
			>
				{t('msg.confirm')}
			</Button>
		</StyledModal>
	);
};

export default AlertConfirm;