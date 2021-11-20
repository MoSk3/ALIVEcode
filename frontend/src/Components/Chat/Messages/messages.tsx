import { Container, Row } from 'react-bootstrap';
import CardContainer from '../../UtilsComponents/CardContainer/CardContainer';

const Messages = (props: { username: string; text: string; time: any }) => {
	return (
		<Container>
			<Row>
				<div className="message-user ">{props.username}</div>
				<div className="message-time">{props.time}</div>
			</Row>

			<div className="message-text ">{props.text}</div>
		</Container>
	);
};
export default Messages;
