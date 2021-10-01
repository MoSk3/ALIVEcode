import { HomeCardProps, StyledHomeCard } from './homeCardTypes';
import { useHistory } from 'react-router';
import { Card, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { ThemeContext } from '../../../state/contexts/ThemeContext';

const HomeCard = ({ title, content, to, img, onClick }: HomeCardProps) => {
	const history = useHistory();
	const { theme } = useContext(ThemeContext);

	return (
		<StyledHomeCard
			onClick={() => {
				onClick ? onClick() : to && history.push(to);
			}}
		>
			<Row noGutters>
				<Col md={4}>
					<img src={img} className="card-img" alt="..."></img>
				</Col>
				<Col md={8}>
					<div style={{ padding: '25px', color: theme.color.foreground }}>
						<Card.Title as="h4">{title}</Card.Title>
						<Card.Text as="p">{content}</Card.Text>
					</div>
				</Col>
			</Row>
		</StyledHomeCard>
	);
};

export default HomeCard;