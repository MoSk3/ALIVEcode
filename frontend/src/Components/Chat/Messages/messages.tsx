import { Container, Row } from 'react-bootstrap';
import Jihene from '../../../assets/images/creators/Jihene.jpg';

const Messages = (props: {
	username: string;
	text: string;
	time: any;
	image: any;
}) => {
	return (
		<Container style={{ paddingTop: '5px' }}>
			<Row>
				<img
					className="message-image rounded-circle"
					style={{ width: '45px', maxHeight: '45px' }}
					alt={props.image}
					src={
						props.image
							? `http://localhost:8000/uploads/${props.image}`
							: Jihene
					}
				/>
				<div>
					<div
						className="message-user"
						style={{
							paddingLeft: '10px',
							fontWeight: 'bold',
							fontSize: '18px',
						}}
					>
						{props.username}{' '}
					</div>
					<div className="message-text" style={{ paddingLeft: '10px' }}>
						{props.text}
					</div>
				</div>
				<div
					className="message-time"
					style={{ fontSize: '12px', paddingLeft: '10px', paddingTop: '5px' }}
				>
					{props.time}
				</div>
			</Row>
		</Container>
	);
};
export default Messages;
