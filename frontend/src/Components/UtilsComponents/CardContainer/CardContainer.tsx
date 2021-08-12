import { CardContainerProps, StyledCardContainerProps } from './cardContainerTypes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import styled from 'styled-components';
import { Container, Row } from 'react-bootstrap';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';

const StyledDiv = styled.div`
	text-align: center;
	margin-top: 50px;

	.card-container-title {
		font-size: ${({ titleSize }: StyledCardContainerProps) =>
			titleSize || '26px'};
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
		background-color: var(--primary-color);
		color: white;
		margin-bottom: 0px;
		padding: 10px;
	}

	.card-container-body {
		overflow-x: ${({ scrollX }: StyledCardContainerProps) =>
			scrollX ? 'scroll' : 'auto'};
		overflow-y: ${({ scrollY }: StyledCardContainerProps) =>
			scrollY ? 'scroll' : 'auto'};
		height: auto;
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 25px;
		background-color: rgba(255, 255, 255, 0.75);
		box-shadow: 0px 15px 30px 0px rgb(170, 170, 170);
	}
`;

const CardContainer = ({
	children,
	title,
	titleSize,
	icon,
	scrollX,
	scrollY,
	onIconClick,
	style,
}: CardContainerProps) => {
	return (
		<StyledDiv
			style={style}
			scrollX={scrollX}
			scrollY={scrollY}
			titleSize={titleSize}
		>
			<div className="card-container-title">
				{title} {icon && <IconButton icon={icon} onClick={onIconClick} />}
			</div>
			<Container fluid className="card-container-body">
				<CenteredContainer vertically horizontally>
					<Row className="mt-4 pb-4 pt-2">{children}</Row>
				</CenteredContainer>
			</Container>
		</StyledDiv>
	);
};

export default CardContainer;