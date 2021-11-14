import RoomList from '../../Components/Chat/RoomList/roomList'
import MessagesList from '../../Components/Chat/MessagesList/messageList';
import MessageForm from '../../Components/Chat/MessageForm/messageForm';
import RoomForm from '../../Components/Chat/RoomForm/roomForm';

const Chat = () => {
	return (
		<div className="Chat">
			<RoomList />
			<MessagesList />
			<MessageForm />
			<RoomForm />
		</div>
	);
};

export default Chat;