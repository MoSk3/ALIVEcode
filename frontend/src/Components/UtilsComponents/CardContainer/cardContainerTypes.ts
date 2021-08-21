
export type StyledCardContainerProps = {
	scrollX?: boolean;
	scrollY?: boolean;
	titleSize?: string;
	height?: string;
};

export type CardContainerProps = {
	title?: string;
	style?: any;
	className?: string;
	icon?: any;
	height?: string;
	onIconClick?: any;
	scrollX?: boolean;
	scrollY?: boolean;
	children?: React.ReactNode;
	titleSize?: string;
};