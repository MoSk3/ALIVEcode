import { AboutCardProps } from './aboutCardTypes';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';

const StyledDiv = styled(Col)`
	background-color: var(--background-color);
	color: var(--foreground-color);
	border-radius: 25px;
	box-shadow: 0px 0px 2px rgb(130 130 130);
	padding: 15px;
	margin-bottom: 25px;
	margin-left: 7px;
	margin-right: 7px;
`;

const AboutCard = ({ img, name }: AboutCardProps) => {
	return (
		<StyledDiv lg>
			<img src={img} alt={`alive-${name}`} />
			<div>
				<h3>{name}</h3>
			</div>
		</StyledDiv>
	);
};

export default AboutCard;