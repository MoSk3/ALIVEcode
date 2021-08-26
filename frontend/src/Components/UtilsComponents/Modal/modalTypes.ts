import { ButtonVariants } from '../Button/buttonTypes';
import { ModalProps as BootModalProps } from 'react-bootstrap';

export interface ModalProps extends BootModalProps {
	title: string;
	open: boolean;
	size?: 'sm' | 'lg' | 'xl';
	buttonVariant?: ButtonVariants;
	closeButton?: boolean;
	children?: React.ReactNode;
	hideFooter?: boolean;
	onClose: () => void;
};