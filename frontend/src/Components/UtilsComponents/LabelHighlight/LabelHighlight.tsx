import { LabelHighlightProps, StyledLabelHighlightProps } from './LabelHighlightTypes';
import styled from 'styled-components';

const StyledDiv = styled.div`
	color: ${({ textColor }: StyledLabelHighlightProps) =>
		textColor || 'inherit'};
	background-color: ${({ color }: StyledLabelHighlightProps) =>
		color || 'var(--secondary-color)'};
	padding: ${({ padding }: StyledLabelHighlightProps) => padding || '10px'};
	border-radius: ${({ borderRadius }: StyledLabelHighlightProps) =>
		borderRadius || '10px'};
	font-size: ${({ fontSize }: StyledLabelHighlightProps) =>
		fontSize || 'inherit'};
`;

const LabelHighlight = (props: LabelHighlightProps) => {
	return (
		<StyledDiv {...props}>
			{props.text ? <>{props.text}</> : <>{props.children}</>}
		</StyledDiv>
	);
};

export default LabelHighlight;