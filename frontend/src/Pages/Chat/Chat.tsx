import RoomList from '../../Components/Chat/RoomList/roomList'
import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import RoomForm from '../../Components/Chat/RoomForm/roomForm';

const Chat = () => {
	return (
		<div className="Chat">
			<RoomList />
			<MessageForm />
			<RoomForm />
		</div>
	);
};

export default Chat;