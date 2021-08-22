
export type ButtonVariants = "primary" | "secondary" | "danger";

export type ButtonProps = {
	to?: string;
	variant: ButtonVariants;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	children?: React.ReactNode;
};