import RoomList from '../../Components/Chat/RoomList/roomList'
import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import RoomForm from '../../Components/Chat/RoomForm/roomForm';
import styled from 'styled-components';
import CenteredContainer from '../../Components/UtilsComponents/CenteredContainer/CenteredContainer';
import CardContainer from '../../Components/UtilsComponents/CardContainer/CardContainer';
import { Container, Row, Col } from 'react-bootstrap';
const StyledCenteredContainer = styled(CenteredContainer)`
	display: flex;
	width: 100%;
	.row-prof {
		margin-top: 10px;
		margin-bottom: 10px;
	}
`;

const Chat = () => {
	return (
		<div className="Chat">
			<StyledCenteredContainer className="chat">
				<div className="text-left col-sm-3">nerrre</div>
				<MessageForm />
				<div className="col-sm-2">coucou</div>
			</StyledCenteredContainer>
		</div>
	);
};

export default Chat;