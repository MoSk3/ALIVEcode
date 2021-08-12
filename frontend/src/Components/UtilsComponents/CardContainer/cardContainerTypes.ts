
export type StyledCardContainerProps = {
	scrollX?: boolean;
	scrollY?: boolean;
	titleSize?: string;
};

export type CardContainerProps = {
	title?: string;
	style?: any;
	icon?: any;
	onIconClick?: any;
	scrollX?: boolean;
	scrollY?: boolean;
	children?: React.ReactNode;
	titleSize?: string;
};