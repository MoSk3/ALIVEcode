
export type ButtonVariants = "primary" | "secondary" | "danger";

export type StyledButtonProps = {
	padding?: string;
};

export type ButtonProps = {
	to?: string;
	className?: string;
	variant: ButtonVariants;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	children?: React.ReactNode;
	padding?: string;
};