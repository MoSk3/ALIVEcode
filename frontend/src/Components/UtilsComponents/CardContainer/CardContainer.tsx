import { CardContainerProps, StyledCardContainerProps } from './cardContainerTypes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import styled from 'styled-components';
import { Container, Row } from 'react-bootstrap';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';

const StyledDiv = styled.div`
	text-align: center;
	margin-top: 50px;
	position: relative;

	.card-container-title {
		font-size: ${({ titleSize }: StyledCardContainerProps) =>
			titleSize || '26px'};
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
		background-color: var(--primary-color);
		color: var(--background-color);
		margin-bottom: 0px;
		padding: 10px;
	}

	.card-container-body {
		overflow-x: ${({ scrollX }: StyledCardContainerProps) =>
			scrollX ? 'scroll' : 'auto'};
		overflow-y: ${({ scrollY }: StyledCardContainerProps) =>
			scrollY ? 'scroll' : 'auto'};
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 25px;
		background-color: rgba(var(--background-color-rgb), 0.75);
		box-shadow: 0px 15px 30px 0px rgb(170, 170, 170);
		min-height: ${({ height }: StyledCardContainerProps) => height ?? 'auto'};
		padding: 20px;
	}

	.card-container-body-centered {
		min-height: ${({ height }: StyledCardContainerProps) => height ?? 'auto'};
	}

	.card-container-row {
		justify-content: center;
	}
`;

/**
 * Container used to display cards components in a grid
 *
 * @param title title in the header of the component
 * @param titleSize css size of the title (optional)
 * @param icon icon displayed after the title (optional)
 * @param height minimumHeight that takes the component (optional)
 * @param asRow adds a row that wraps around the children (optional)
 * @param scrollX css scrollX property (optional)
 * @param scrollY css scrollY property (optional)
 * @param onIconClick function that triggers onClick of icon (optional)
 * @param style tsx style property (optional)
 * @param className (optional)
 * @param children
 * @returns tsx element
 *
 * @author Enric
 */
const CardContainer = ({
	children,
	className,
	title,
	titleSize,
	icon,
	scrollX,
	scrollY,
	onIconClick,
	style,
	height,
	asRow,
}: CardContainerProps) => {
	return (
		<StyledDiv
			height={height}
			style={style}
			scrollX={scrollX}
			scrollY={scrollY}
			titleSize={titleSize}
			className={className}
		>
			<div className="card-container-title">
				{title} {icon && <IconButton icon={icon} onClick={onIconClick} />}
			</div>
			<Container fluid className="card-container-body">
				<CenteredContainer
					className="card-container-body-centered"
					vertically
					horizontally
				>
					{asRow ? (
						<Row className="card-container-row">{children}</Row>
					) : (
						<>{children}</>
					)}
				</CenteredContainer>
			</Container>
		</StyledDiv>
	);
};

export default CardContainer;