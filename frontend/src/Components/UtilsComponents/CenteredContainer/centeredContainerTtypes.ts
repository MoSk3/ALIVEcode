
export type StyledCenteredContainerProps = {
	textAlign?:
		| 'center'
		| 'left'
		| 'right'
		| 'start'
		| 'end'
		| 'justify'
		| 'inherit'
		| 'initial'
		| 'unset';
};

export type CenteredContainerProps = {
	children?: React.ReactNode;
	vertically?: boolean;
	horizontally?: boolean;
	className?: string;
	style?: any;
	startAtTop?: boolean;
	textAlign?:
		| 'center'
		| 'left'
		| 'right'
		| 'start'
		| 'end'
		| 'justify'
		| 'inherit'
		| 'initial'
		| 'unset';
};