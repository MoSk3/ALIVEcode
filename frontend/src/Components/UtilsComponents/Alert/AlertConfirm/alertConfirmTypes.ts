import { ModalProps } from '../../Modal/modalTypes';
export interface AlertConfirmProps extends ModalProps {
	onConfirm?: () => void;
	onCancel?: () => void;
};
