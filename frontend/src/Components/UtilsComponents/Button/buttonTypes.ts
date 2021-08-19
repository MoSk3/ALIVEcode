
export type ButtonTypes = "primary" | "secondary" | "danger";

export type ButtonProps = {
	to?: string;
	variant: ButtonTypes;
	type?: 'button' | 'submit' | 'reset';
	onClick?: () => void;
	children?: React.ReactNode;
};