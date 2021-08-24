import { ButtonVariants } from '../Button/buttonTypes';

export type ModalProps = {
	title: string;
	open: boolean;
	size?: 'sm' | 'lg' | 'xl';
	buttonVariant?: ButtonVariants;
	closeButton?: boolean;
	children?: React.ReactNode;
	hideFooter?: boolean;
	onClose: () => void;
};